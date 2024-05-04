import shutil
import pathlib
from argparse import ArgumentParser

BASE_DIR = pathlib.Path(__file__).parent.absolute()


def delete_images():
    folder = BASE_DIR.joinpath('media', 'images')
    images = folder.glob('**/*.jpg')
    for image in images:
        if image.is_file():
            image.unlink()

    cache_folder = BASE_DIR.joinpath('media', 'CACHE', 'images', 'images')
    if cache_folder.is_dir():
        shutil.rmtree(cache_folder)


if __name__ == '__main__':
    parser = ArgumentParser()
    parser.add_argument('name', type=str)
    namespace = parser.parse_args()

    if namespace.name == 'images':
        delete_images()
