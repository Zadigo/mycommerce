import asyncio
from django.core.cache import cache

from cart.models import Cart
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncJsonWebsocketConsumer



class CartConsumerMixin:
    pass


class PollCartConsumer(AsyncJsonWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.must_connect = True

    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add('cart_updates', self.channel_name)

        @database_sync_to_async
        def poll_database():
            qs = cache.get('cart_items', None)
            if qs is not None:
                return list(qs)

            qs1 = Cart.objects.all().order_by('-created_on')[:10]
            if qs1 != qs:
                merged = qs1.union(qs)
            else:
                merged = qs1

            merged = merged.values('id', 'name', 'created_on')
            cache.set('cart_items', merged, 1)

            return list(merged)


        async def main():
            while True:
                latest_item = await poll_database()
                await self.channel_layer.group_send(
                    'cart_updates',
                    {
                        'type': 'cart.update',
                        'item': latest_item
                    }
                )
                await asyncio.sleep(60)

        task = asyncio.create_task(main())
        await task

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard('cart_updates', self.channel_name)
        await self.disconnect(close_code)

    async def receive_json(self, content, **kwargs):
        pass
