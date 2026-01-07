import asyncio
import json
import pathlib
import random
from collections import defaultdict
from functools import lru_cache
from typing import DefaultDict

BASE_DIR = pathlib.Path(__file__).parent.absolute()

MYCOMMERCE_DIR = BASE_DIR.parent.absolute()

PRODUCTS_DIR = MYCOMMERCE_DIR / 'frontend' / 'public' / 'images'

NODE_FILE = BASE_DIR / 'product.json'

IMAGE_DIRS: DefaultDict[str, list[pathlib.Path]] = defaultdict(list)

NUMBER_OF_PRODUCTS = 50

print(NODE_FILE)


def get_random_group():
    """Return a random key from the IMAGE_DIRS dictionary."""
    keys = list(IMAGE_DIRS.keys())
    return random.choice(keys)


@lru_cache(maxsize=5)
async def collect_files():
    directories = [d for d in PRODUCTS_DIR.iterdir() if d.is_dir()]
    for directory in directories:
        IMAGE_DIRS[directory.name] = list(directory.glob('*.jp*g'))
    return IMAGE_DIRS


async def open_node_file() -> dict | None:
    if NODE_FILE.exists():
        # async with await asyncio.to_thread(open, NODE_FILE, 'r') as f:
        #     content = await asyncio.to_thread(f.read)
        #     return content
        with open(NODE_FILE, 'r') as f:
            return json.load(f)


def generate_images(images: list[pathlib.Path]):
    for i, image in enumerate(images):
        yield {
            "id": i + 1,
            "createdOn": "2025-1-1",
            "isMainImage": False,
            "name": image.stem.upper(),
            "original": str(image),
            "thumbnail": str(image),
            "variant": "pink-something"
        }


async def main():
    images, content = await asyncio.gather(
        collect_files(),
        open_node_file()
    )

    products = []

    for i in range(NUMBER_OF_PRODUCTS):
        group = get_random_group()
        product_copy = {**content}

        product_copy['node']['id'] = i + 1

        list_of_images = list(generate_images(images[group]))
        product_copy['node']['productImages'] = list_of_images

        main_image = random.choice(list_of_images)
        main_image['isMainImage'] = True
        product_copy['node']['mainImage'] = main_image

        products.append(product_copy)

    with open(BASE_DIR / 'products_node.json', 'w') as f:
        import json
        json.dump(products, f, indent=4)


if __name__ == '__main__':
    asyncio.run(main())
