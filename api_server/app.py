import json

import pandas
from quart import Quart, jsonify, request
from quart_cors import cors

from mycommerce.api_server import MEDIA_PATH, PROJECT_PATH, get_debug

app = Quart(__name__, root_path=PROJECT_PATH)
cors_app = cors(
    app,
    allow_credentials=True,
    allow_origin=[
        'http://localhost:5173'
    ]
)

# cache = pymemcache.Client(('127.0.0.1', 11211))


@cors_app.route('/api/v1/cities', methods=['get'])
async def cities():
    path = MEDIA_PATH.joinpath('cities.csv')
    df = pandas.read_csv(path)

    data = []
    city = request.args.get('city', None)

    if city is not None:
        df = df[['city_code', 'zip_code', 'department_name', 'region_name']]
        result = df.isin({'city_code': [city]})
        cities = df[result.city_code]

        data = json.loads(
            cities.to_json(
                force_ascii=False,
                orient='records'
            )
        )
    return jsonify(data)


if __name__ == '__main__':
    app.run('127.0.0.1', debug=get_debug())
