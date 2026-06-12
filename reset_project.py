"""Use this module with care. This is solely
for testing/development purposes and allows to 
reset the project to a blank state by removing 
stored images and products in the database which
can be numerous and complicated to delete one by one.

It can also be used to delete migration files from
the project
"""

import argparse
import pathlib
import shutil

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


def delete_migration_files():
    folders = BASE_DIR.glob('**/migrations')

    valid_files: list[list[pathlib.Path]] = []
    for folder in folders:
        files = folder.glob('**/*.py')
        valid_files.append(
            filter(
                lambda x: not x.name.startswith('__'),
                files
            )
        )

    for iterator in valid_files:
        for file in iterator:
            if file.exists() and file.is_file():
                file.unlink()
                print('Deleted', file)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('name', type=str, help='Function to use')
    namespace = parser.parse_args()

    if namespace.name == 'delete_migration_files':
        delete_migration_files()
    elif namespace.name == 'images':
        delete_images()
