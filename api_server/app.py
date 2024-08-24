from quart import Quart
from quart_cors import cors
from mycommerce.api_server import PROJECT_PATH, get_debug

app = Quart(__name__, root_path=PROJECT_PATH)
cors_app = cors(app)


if __name__ == '__main__':
    app.run('127.0.0.1', debug=get_debug())
