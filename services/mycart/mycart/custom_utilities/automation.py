from urllib.parse import urljoin

from django.conf import settings
from requests import Session
from requests.auth import HTTPBasicAuth
from requests.models import Request


class BaseWebhook:
    """A base class for sending requests to the
    N8N endpoint in order to trigger additional
    automations for external apps that require
    updating

    >>> automation = Webhook(request, "endpoint")
    ... automation.send(json={"email": "test@gmail.com"})
    """

    def __init__(self, request, path, *, base_port=5678):
        self.api_url = None
        self.request = request
        self.path = path
        self.errors = []
        self.completed = False
        self.include_port = False
        self.base_port = base_port

    @property
    def get_scheme(self):
        return 'https' if self.request.is_secure() else 'http'

    @property
    def has_errors(self):
        return len(self.errors) > 0

    @property
    def get_api_url(self):
        """Returns the N8N url to use for the API
        endpoint"""
        api_url = getattr(settings, 'N8N_TEST_API_URL')
        if not settings.DEBUG:
            api_url = getattr(settings, 'N8N_API_URL')
        return api_url

    def get_headers(self, **extra_headers):
        base_headers = {'Content-Type': 'application/json'}
        return base_headers | extra_headers

    def create_request(self, method='post', data=None, fail_silently=True, request_params={}):
        if self.get_api_url is None:
            self.errors.append(('api_url', 'Not set'))

            if fail_silently:
                return False
            else:
                raise ValueError('Could not get N8N_HOST')

        final_url = urljoin(self.get_api_url, self.path)

        session = Session()
        request = Request(
            method=method,
            url=final_url,
            headers=self.get_headers(),
            data=data,
            **request_params
        )
        prepared_request = session.prepare_request(request)
        return session, prepared_request

    def send(self, method='post', fail_silently=True, **kwargs):
        session, prepared_request = self.create_request(
            method=method,
            **kwargs
        )

        try:
            response = session.send(prepared_request)
        except Exception as e:
            self.errors.append(('', e.args))

            if not fail_silently:
                raise Exception(e)
            return False
        else:
            if not response.ok:
                self.errors.append(
                    (
                        'request',
                        response.content.decode('utf-8')
                    )
                )
            else:
                self.completed = True
                return response.json()


class Webhook(BaseWebhook):
    """Use this class to send requests to N8N
    without any authentication parameters"""


class AuthenticationMixin:
    def set_authorization(self, prepared_request, headers):
        """Sets the authorization header on the prepared request"""
        prepared_request.headers.update(**headers)


class TokenAuthenticationMixin(AuthenticationMixin):
    def __init__(self, request, path, token, bearer='Token', **kwargs):
        self.bearer = bearer
        self.token = token
        super().__init__(request, path, **kwargs)

    def create_authorization_header(self, authorization_token, **extra_headers):
        headers = self.get_headers(**extra_headers)
        if authorization_token is not None:
            headers.update(
                {
                    'Authorization': f'{self.bearer} {authorization_token}'
                }
            )
        return headers


class BaseAuthenticationWebhook(AuthenticationMixin, BaseWebhook):
    """Use this class to send requests using a username
    and password authentication header to N8N"""

    def __init__(self, request, path, username, password, **kwargs):
        self.username = username
        self.password = password
        super().__init__(request, path, **kwargs)

    def get_authentication(self):
        """Authenticate a request to a webhook"""
        return (self.username, self.password)

    def create_request(self, method='post', **kwargs):
        session, prepared_request = super().create_request(method, **kwargs)
        prepared_request.prepare_auth(self.get_authentication())
        return session, prepared_request


class TokenAuthenticationWebhook(TokenAuthenticationMixin, BaseWebhook):
    """Use this class to send requests using a simple
    a authentication token to N8N"""

    def create_request(self, method='post', **kwargs):
        session, prepared_request = super().create_request(method=method, **kwargs)
        authentified_headers = self.create_authorization_header(self.token)
        self.set_authorization(prepared_request, authentified_headers)
        return session, prepared_request


class JWTAuthenticationWebhook(TokenAuthenticationWebhook):
    """Use this class to send requests using a JWT
    authentication token to N8N"""
