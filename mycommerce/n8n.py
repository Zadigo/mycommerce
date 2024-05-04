import os
from urllib.parse import urljoin

import requests
from django.conf import settings
from django.contrib.sites.shortcuts import get_current_site
from requests.auth import HTTPBasicAuth


class Webhook:
    """A base class for sending requests to the
    N8N endpoint in order to trigger additional
    automations for external apps that require
    updating

    >>> automation = Webhook(request, "endpoint")
    ... automation.send(json={"email": "test@gmail.com"})
    """

    def __init__(self, request, path, *, credentials={}, base_port=5678, bearer='Token'):
        self.api_url = None
        self.request = request
        self.path = path
        self.credentials = credentials
        self.errors = []
        self.completed = False
        self.bearer = bearer
        self.include_port = False
        self.base_port = base_port

    @property
    def get_scheme(self):
        return 'https' if self.request.is_secure() else 'http'

    @property
    def has_errors(self):
        return len(self.errors) > 0

    def get_authentication(self):
        """Authenticate a request to a webhook"""
        if not self.credentials:
            username = getattr(settings, 'N8N_REQUEST_USERNAME', None)
            password = getattr(settings, 'N8N_REQUEST_PASSWORD', None)

            # If no credentials were set for the request,
            # just return None
            if username is None and password is None:
                return None
            self.credentials.update(username=username, password=password)
        return HTTPBasicAuth(**self.credentials)

    def set_authorization(self, headers):
        authorizaton_token = getattr(
            settings, 'N8N_AUTHENTICATION_TOKEN', None)
        if authorizaton_token is not None:
            headers.update(
                {'Authorization': f'{self.bearer} {authorizaton_token}'})

    def get_headers(self):
        return {'Content-Type': 'application/json'}

    def get_api_url(self, use_djano_sites=True):
        # First, try to get the url
        # from the settings file and
        # then from the environment
        url_from_environment = os.environ.get('N8N_HOST', None)
        api_url = getattr(settings, 'N8N_HOST', url_from_environment)

        if use_djano_sites and api_url is None:
            # Final option, try to construct it
            # using the Django sites framework.
            # The N8N host is a subdomain of the
            # site: n8n.example.com
            site = get_current_site(self.request)
            api_url = f'n8n.{site.domain}'

        if api_url is not None:
            if self.include_port:
                api_url = f'{self.get_scheme}://{api_url}:{self.base_port}'
            else:
                api_url = f'{self.get_scheme}://{api_url}'

            if settings.DEBUG:
                return urljoin(api_url, f'webhook-test/{self.path}')
            else:
                return urljoin(api_url, f'webhook/{self.path}')

        return api_url

    def send(self, fail_silently=True, **params):
        self.api_url = self.get_api_url()

        if self.api_url is None:
            self.errors.append(('api_url', 'Not set'))
            if fail_silently:
                return False
            else:
                raise ValueError('Could not get N8N_HOST')

        # authentication = self.get_authentication()
        # params.update(auth=authentication)

        headers = self.get_headers()
        self.set_authorization(headers)
        params.update(headers=headers)

        try:
            response = requests.post(self.api_url, **params)
        except Exception as e:
            self.errors.append(('', e.args))
            if not fail_silently:
                raise Exception(e)
            return False
        else:
            if not response.ok:
                self.errors.append((
                    'request',
                    response.content.decode('utf-8')
                ))
            self.completed = True
            return response.ok
