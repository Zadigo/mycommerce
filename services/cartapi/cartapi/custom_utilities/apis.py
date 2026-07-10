import os
import string
from collections import OrderedDict, defaultdict
from urllib.parse import urlencode, urljoin

import requests
from django.dispatch import Signal
from requests import Request, Session

completed = Signal()


class UrlQuery(OrderedDict):
    """Custom dictionary class that stores key-value 
    pairs for creating a query string for a provided URL

    >>> UrlQuery(name='Firstname', value='Lastname')
    """

    def __init__(self, *, remove_empty_query=False, **kwargs):
        super().__init__()

        final_query = defaultdict(str)
        if remove_empty_query:
            for key, value in kwargs.items():
                if value == '' or value == None:
                    continue

                if isinstance(value, bool):
                    value = str(value).lower()

                final_query[key] = value
        else:
            final_query = final_query | kwargs
        self.update(**final_query)

    def __repr__(self):
        items = map(lambda x: f'{x[0]}="{x[1]}"', self.items())
        query_text = ' '.join(items)
        return f'<UrlQuery: {query_text}>'

    @property
    def query(self):
        return urlencode(self)

    def get_url_with_query(self, url):
        return url if self.query == '' else f'{url}?{self.query}'


class BaseRequest:
    """Base class to request data from API endpoints 
    on the internet. You can extend this class to create 
    custom requests

    >>> instance = BaseRequest()
    ... await instance.get_response()
    ... response = instance.response_data

    You can personalize this class depending on the
    path that you want to query:

    >>> class CustomRequest(BaseRequest):
            base_url = 'http://example.com'
            path = '/api/v1/example'

    Before the response is stored, it passed
    in the `clean` function where you can implement
    custom logic to the data

    >>> class CustomRequest(BaseRequest):
            def clean(data):
                data['cleaned'] = True
                return data
    """

    base_url = None
    path = None
    path_parameters = {}
    query_class = UrlQuery
    log_message = 'Request for {url} {status_code}'

    def __init__(self, *, remove_empty_query=False, **extra_query):
        self.response_data = {}
        self.consumed_url = None
        self.extra_query = extra_query
        self.remove_empty_query = remove_empty_query
        self.errors = []

    @property
    async def url(self):
        """Constructs the final url to use for
        the request. Paths contain parameters as
        in `/celebrity/$id` for `/celebrity/1` for
        example are also resolved accordindly """
        base_url = urljoin(self.base_url, self.path)

        if self.path_parameters:
            result = string.Template(base_url)
            base_url = result.substitute(self.path_parameters)

        query = await self.get_url_query()
        return query.get_url_with_query(base_url)

    @property
    async def has_errors(self):
        return len(self.errors) > 0

    async def on_response_complete(self, response):
        """Callback function that is executed immediately after 
        the request is completed. This method is intended to be overridden 
        in subclasses to implement custom actions that should occur after a 
        request is completed. By default, it does nothing, but you can 
        override it to handle tasks such as logging, processing the response, 
        updating the state, or triggering other actions based on the response.
        """
        return NotImplemented

    async def get_header(self, **kwargs):
        """This method generates a dictionary of default HTTP 
        headers that will be included in the request. These headers 
        typically specify the accepted response format, content type, 
        and user agent information. You can also pass additional headers 
        as keyword arguments, which will be merged with the default headers."""
        default_header = {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1; Win64; x64; rv:47.0) Gecko/20100101 Firefox/47.0'
        }
        return default_header | kwargs

    async def get_url_query(self, **kwargs):
        """Returns the class to instantiate a
        new query to append to the url"""
        kwargs.update(self.extra_query)
        return self.query_class(
            remove_empty_query=self.remove_empty_query,
            **kwargs
        )

    async def create_request(self, **request_params):
        """Creates and prepares a new request object for sending. 
        This method constructs a new request object using the provided
        parameters and prepares it for sending. It resolves the full URL 
        including path parameters and query string, and sets up the request 
        method (default is 'GET')"""
        session = Session()
        url = await self.url

        request_params.update({'url': url})
        if 'method' not in request_params:
            request_params['method'] = 'get'

        request = Request(**request_params)
        prepared_request = session.prepare_request(request)
        return session, prepared_request

    async def send(self, header={}, request_params={}):
        """This method is responsible for preparing and sending the 
        HTTP request to the API server. It handles the construction 
        of the full URL, setting up the headers, and managing the 
        request parameters. After the request is sent, it processes 
        the response, handles errors, and logs the result"""
        session, prepared_request = await self.create_request(**request_params)

        final_header = await self.get_header(**header)
        prepared_request.headers.update(final_header)

        response = session.send(prepared_request)
        await self.on_response_complete(response)
        self.consumed_url = response.url

        from backend_api.app import app
        if response.ok:
            self.response_data = await self.clean(response.json())
            message = self.log_message.format(
                url=self.consumed_url,
                status_code=response.status_code
            )
            app.logger.info(message)
        else:
            error_response = response.json()
            error_response['url'] = self.consumed_url

            self.errors.append(error_response)
            message = self.log_message.format(
                url=self.consumed_url,
                status_code=response.status_code
            )
            app.logger.error(message)

        completed.send(
            self,
            errors=self.errors,
            response=self.response_data
        )

    async def get_response(self, **kwargs):
        """This method is the main entry point for executing the 
        request and retrieving the response. It ensures that 
        the request is sent, processes the response, and appropriately 
        handles any errors. You should call this method instead of 
        calling send directly to ensure proper error handling and 
        response processing."""
        await self.send(**kwargs)
        return self.errors if await self.has_errors else self.response_data

    async def clean(self, data):
        return data


class AuthenticationBaseRequest(BaseRequest):
    """A base class to handle authenticated requests 
    to APIs that require authentication. This class 
    extends `BaseRequest` and adds functionality for 
    managing authentication headers and tokens"""

    async def get_header(self, **kwargs):
        base_header = await super().get_header(**kwargs)
        return await self.authenticate_header(base_header)

    async def authenticate_header(self, header, auth_type='Token', token=None):
        """This method enhances the headers by incorporating an authentication 
        token for secure API interactions. By default, it employs a token-based 
        authentication approach, but this behavior can be tailored by overriding 
        the method. The authentication token is appended to the provided headers 
        under the specified authentication type"""
        header['Authorization'] = f'{auth_type} {token}'
        return header

    async def new_authentication_token_headers(self):
        """Use this class to implement the logic that allows us
        to generate a new authentication token that would be 
        used to query certain APIs"""
        return {}

    async def request_new_authentication_token(self, env_key, token_name, url):
        """This method orchestrates the process of obtaining a fresh authentication 
        token from a designated API endpoint. It constructs and dispatches a POST 
        request to the specified URL, armed with headers configured via the 
        new_authentication_token_headers method. Upon successful retrieval 
        of the token, it stores it in the environment variables under the 
        provided env_key"""
        headers = await self.new_authentication_token_headers()
        try:
            response = requests.post(url, headers=headers)
        except:
            pass
        else:
            if response.ok:
                data = response.json()
                os.environ.setdefault(env_key, data[token_name])
