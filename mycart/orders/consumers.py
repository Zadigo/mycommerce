from channels.generic import AsyncJsonWebsocketConsumer


class LiveOrdersConsumer(AsyncJsonWebsocketConsumer):
    async def connect(self):
        await self.accept()
        await self.channel_layer.group_add('orders', self.channel_name)

    async def disconnect(self, code):
        await self.channel_layer.group_discard('orders', self.channel_name)

    async def send_json(self, data):
        action = data['action']
