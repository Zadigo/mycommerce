from quart import Quart, jsonify
from quart_cors import cors

from mycommerce.api_server import PROJECT_PATH, get_debug

app = Quart(__name__, root_path=PROJECT_PATH)
cors_app = cors(
    app,
    allow_credentials=True,
    allow_origin=[
        'http://localhost:5173'
    ]
)


@cors_app.route('/api/v1/test', methods=['post'])
def testing():
    return jsonify({'state': True})


if __name__ == '__main__':
    app.run('127.0.0.1', debug=get_debug())
