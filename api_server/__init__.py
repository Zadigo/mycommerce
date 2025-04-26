import dotenv
import pathlib
import os


BASE_PROJECT = pathlib.Path(__file__).parent.absolute()


MEDIA_PATH = BASE_PROJECT / 'media'


ENV_PATH = BASE_PROJECT / '.env'

if ENV_PATH.exists():
    dotenv.load_dotenv(ENV_PATH / '.env')


def debug_mode():
    env_path = BASE_PROJECT / '.env'
    if env_path.exists():
        dotenv.load_dotenv(BASE_PROJECT / '.env')

    debug = os.getenv('DEBUG')
    return True if debug == '1' else False


def get_host():
    if debug_mode():
        return None
    return '0.0.0.0'
