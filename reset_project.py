import pathlib
import argparse


def delete_migration_files():
    path = pathlib.Path(__file__).parent.absolute()
    folders = path.glob('**/migrations')

    valid_files = []
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
                print('Deleted', file)


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('name', type=str, help='Function to use')
    namespace = parser.parse_args()

    if namespace.name == 'delete_migration_files':
        delete_migration_files()
