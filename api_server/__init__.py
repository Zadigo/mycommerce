import dotenv
import pathlib
import os
PROJECT_PATH = pathlib.Path(__file__).parent.absolute()

dotenv.load_dotenv(PROJECT_PATH / '.env')


def get_debug():
    debug = os.getenv('DEBUG')
    return True if debug == '1' else False
