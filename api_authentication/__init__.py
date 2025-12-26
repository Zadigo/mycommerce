import logging.handlers
import dotenv
import pathlib
import os
import logging
import yaml


BASE_PROJECT = pathlib.Path(__file__).parent.absolute()


MEDIA_PATH = BASE_PROJECT / 'media'


ENV_PATH = BASE_PROJECT / '.env'


if ENV_PATH.exists():
    dotenv.load_dotenv(ENV_PATH)


def create_logger(name: str) -> logging.Logger:
    """Create and configure a custom logger from
    a YAML file"""
    path = BASE_PROJECT / 'logging.yaml'
    with open(path, 'r') as f:
        config = yaml.safe_load(f)
        logging.config.dictConfig(config)
        return logging.getLogger(name)
