import asyncio
import json

import pandas
from hypercorn.asyncio import serve
from hypercorn.config import Config
from quart import Quart, jsonify, request
from quart_cors import cors

from api_server import BASE_PROJECT, MEDIA_PATH, debug_mode, get_host

app = Quart(__name__, root_path=BASE_PROJECT)
cors_app = cors(
    app,
    allow_credentials=True,
    allow_origin=[
        'http://localhost:5173',
        'http://localhost:3000'
    ]
)

# cache = pymemcache.Client(('127.0.0.1', 11211))


@cors_app.get('/api/v1/cities')
async def cities():
    def transform(df):
        return json.loads(
            df.to_json(
                force_ascii=False,
                orient='records'
            )
        )

    def read_file():
        path = MEDIA_PATH.joinpath('cities.csv')
        return pandas.read_csv(path)

    try:
        # Try to the get the cache. This is a
        # security measure since on Windows
        # this raises pymemcache can raise a
        # connection error depending on how
        # things were configured
        cached_cities = cache.get('cities')
        if cached_cities is None:
            path = MEDIA_PATH.joinpath('cities.csv')
            df = pandas.read_csv(path)

            string_data = df.to_json(orient='records', force_ascii=False)
            data = json.loads(string_data)
            cache.set('cities', data)
    except:
        df = read_file()
    else:
        df = pandas.DataFrame(cached_cities)

    data = []
    city = request.args.get('city')
    state = request.args.get('state')

    if city is not None:
        df = df[['city_code', 'zip_code', 'department_name', 'region_name']]
        result = df.isin({'city_code': [city]})
        cities = df[result.city_code]
        data = transform(cities)

    if state is not None:
        df = df[['region_name', 'region_geojson_name']]
        result = df.isin({'region_geojson_name': [state]})
        states = df[result.region_geojson_name]
        data = transform(states)

    return jsonify(data)


@cors_app.get('/api/v1/orders/delivery-options')
async def delivery_options():
    with open(MEDIA_PATH.joinpath('delivery_options.json'), mode='r') as f:
        return json.load(f)


if __name__ == '__main__':
    if debug_mode():
        cors_app.run(host=get_host(), debug=debug_mode())
    else:
        config = Config()
        production_config = config.from_toml(BASE_PROJECT / 'hypercorn.toml')
        asyncio.run(serve(cors_app, production_config))
