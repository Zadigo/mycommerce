import requests
from celery import shared_task
from celery.utils.log import get_logger

logger = get_logger(__name__)

@shared_task
def check_product_exists(product_id):
    """Check if a product exists in `mystore.Product` 
    service model"""
    try:
        response = requests.get(f'http://127.0.0.1:8000/shop/v1/{product_id}')
        
        if response.status_code == 200:
            return True
        else:
            return False
    except requests.RequestException as e:
        logger.error(f"Error checking product existence: {e}")
        return False
