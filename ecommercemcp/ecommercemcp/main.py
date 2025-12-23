import asyncio
import logging

import httpx
import pydantic
from mcp.server import FastMCP

from ecommercemcp.constants import SHOP_MICROSERVICE_URL

mcp = FastMCP('Ecommerce MCP', dependencies=['httpx', 'redis', 'pandas'])


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
                    query {
                        allProducts(first: null, after: null) {
                            edges {
                                node {
                                    id
                                    name
                                }
                            }
                        }
                    }
                '''
            })
            response.raise_for_status()
        except Exception as e:
            logging.error(f"Error fetching product data: {e}")
            return {}
        else:
            return response.json()


async def main():
    await mcp.run_stdio_async()


if __name__ == '__main__':
    asyncio.run(main())
