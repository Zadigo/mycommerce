from importlib.resources import path
import json
import pathlib
from urllib.parse import urljoin, urlparse

from django import template
from django.conf import settings
from django.conf.urls.static import static
from django.utils.html import format_html
from django.utils.safestring import mark_safe
from django.contrib.sites.shortcuts import get_current_site

register = template.Library()

SERVER_ROOT = 'http://localhost:3000'


# def is_absolute_url(url):
#     return bool(urlparse(url).netloc)


# def manifest_reader(names):
#     filepath = 'static/dist/manifest.json'
#     # if settings.DEBUG:
#     #     scripts = [
#     #         f'{SERVER_ROOT}/@vite/client'
#     #     ]
#     #     for name in names:
#     #         scripts.append(f'{SERVER_ROOT}/{name}')
#     #     return scripts, []
#     # else:
#     #     pass
#     with open(filepath, mode='r') as f:
#         manifest = json.load(f)
#         entry = list(manifest.keys())[-0]
#         data = manifest[entry]
        
#         styles = data['css']
#         scripts = [
#             'static/index.5725aca2.js',
#             data['file']
#         ]
#         # styles.append('static/index.b182f034.css')
#     return scripts, styles


# def process_urls(urls):
#     for url in urls:
#         if is_absolute_url(url):
#             yield url
#         else:
#             items = url.split('/')
#             url = f'static/dist/static/{items[-1]}'
#             yield urljoin('http://127.0.0.1:8000', url)


# @register.simple_tag
# def vite_css(*names):
#     _, styles = manifest_reader(names)
#     style_urls = process_urls(styles)
#     tags = map(lambda x: format_html("<link rel='stylesheet' href={href}>", href=x), style_urls)
#     return mark_safe('\n'.join(tags))


# @register.simple_tag
# def vite_scripts(*names):
#     scripts, _ = manifest_reader(names)
#     script_urls = process_urls(scripts)
#     tags = map(lambda x: format_html("<script type='module' lang='javascript' src='{href}'></script>", href=x), script_urls)
#     return mark_safe('\n'.join(tags))


def manifest_reader(entry='src/main.js') -> tuple[list, dict]:
    filepath = pathlib.Path(settings.FRONT_DIR, 'dist', 'manifest.json')
    with open(filepath, mode='r') as f:
        data = json.load(f)
        manifest = data[entry]
        files = [manifest['file'], *manifest['css']]
        return files, data


@register.simple_tag
def vite_files(*names):
    default_names = ['main']
    default_names.extend(list(names))
    default_names = set(default_names)
    
    files, manifest = manifest_reader()
    
    paths = []
    for name in default_names:
        for item in files:
            if name not in item:
                continue
            paths.append(f'/static/{item}')

    css_tag = "<link rel='stylesheet' href='{path}'>"
    script_tag = "<script type='module' src='{path}'></script>"
    
    tags = []
    for path in paths:
        if path.endswith('.js'):
            tags.append(format_html(script_tag, path=path))
        
        if path.endswith('.css'):
            tags.append(format_html(css_tag, path=path))
    
    client = urljoin(SERVER_ROOT, '@vite/client')
    tags.insert(0, format_html(script_tag, path=client))
    
    return mark_safe('\n'.join(tags))


@register.simple_tag
def vite_app():
    return mark_safe("<div id='app'></div>")
