import asyncio
import logging

import httpx
import pydantic
from mcp.server import FastMCP
from ecommercemcp import BASE_DIR
from ecommercemcp.utils import create_redis_connection
from ecommercemcp.constants import SHOP_MICROSERVICE_URL

mcp = FastMCP('Ecommerce MCP', dependencies=['httpx', 'redis', 'pandas'])


async def before_start():
    """Perform setup tasks before starting the MCP server."""
    tasks = [
        asyncio.create_task(create_redis_connection())
    ]

    await asyncio.wait(tasks, timeout=10, return_when=asyncio.FIRST_COMPLETED)


@mcp.tool(title='Fetch Product Data', description='Fetch product data from an external API.')
async def get_all_products(limit: int = None, offset: int = None) -> dict:
    """Fetch all product data from the shop microservice GraphQL API.

    Args:
        limit (int, optional): The maximum number of products to fetch.
        offset (int, optional): The number of products to skip before starting to collect the result set.

    Returns:
        dict: A dictionary containing product data.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(SHOP_MICROSERVICE_URL, json={
                'query': '''
                    query($limit: Int, $offset: Int) {
                        allProducts(first: $limit, after: $offset) {
                            edges {
                                node {
                                    id
                                    name
                                }
                            }
                        }
                    }
                ''',
                'variables': {
                    'limit': limit,
                    'offset': offset
                }
            })
            response.raise_for_status()
        except Exception as e:
            logging.error(f"Error fetching product data: {e}")
            return {}
        else:
            return response.json()


@mcp.tool(title='Fetch Product by ID', description='Fetch product details by product ID from an external API.')
async def get_product_by_id(product_id: str) -> dict:
    """Fetch product details by product ID from the shop microservice GraphQL API.

    Args:
        product_id (str): The ID of the product to fetch.

    Returns:
        dict: A dictionary containing product details.
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(SHOP_MICROSERVICE_URL, json={
                'query': '''
                    query($id: ID!) {
                        product(id: $id) {
                            id
                            name
                            description
                            price
                        }
                    }
                ''',
                'variables': {
                    'id': product_id
                }
            })
            response.raise_for_status()
        except Exception as e:
            logging.error(f"Error fetching product by ID: {e}")
            return {}
        else:
            return response.json()


@mcp.prompt(title='Fetch Products Prompt', description='Prompt to fetch products from the shop microservice.')
async def get_products_prompt(sort_by: str = 'name', limit: int = 100, is_active: bool = False) -> str:
    """Generate a prompt for fetching products from the shop microservice.

    Returns:
        str: A prompt string.
    """
    return f"""
    Search for the first {limit} products in the shop microservice and return their details.

    Follow these steps or instructions:
    
    1. Sort the products by their '{sort_by}' in ascending order if the field exists otherwise the default
       sorting will be 'price'.
    2. You can only return active products if {is_active} is True

    Finally, provide a short summary or synthesis of the productst that were found which includes the following details:
    
    - Total number of products found.
    - Average price of the products.
    - Minimum and maximum price of the products.
    """


@mcp.resource('papers://papers')
def get_available_folders() -> str:
    """Get a list of available folders in the Papers resource.

    Returns:
        str: A string listing the available folder names.
    """
    papers_dir = BASE_DIR / 'papers'
    if papers_dir.exists() and papers_dir.is_dir():
        items = papers_dir.iterdir()
        topics = (f'- {item.name}\n' for item in items if item.is_dir())
        return f"""# Available topics are: {''.join(topics)}"""
    return "No folders available."


async def main():
    await before_start()
    await mcp.run_stdio_async()


if __name__ == '__main__':
    asyncio.run(main())
