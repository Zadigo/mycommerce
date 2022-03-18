from django.test import RequestFactory, TestCase
from django.contrib.auth import get_user_model
from cart import views

def create_user():
    USER_MODEL = get_user_model()
    user = USER_MODEL.objects.create_user(
        email='lucile@gmail.com',
        password='touparette',
        username='lucile'
    )
    return user
    

class TestCartApi(TestCase):
    fixtures = ['products.json', 'carts.json']
    
    # def test_cart_view(self):
    #     user = create_user()
    #     factory = RequestFactory()
    #     request = factory.post('api/v1/cart', data={'session_id': 'test_session'})
    #     response = views.cart_view(request)
    #     self.assertEqual(response.data['session_id'], 'test_session')
    #     self.assertEqual(len(response.data['results']), 1)
        
    def test_add_to_cart_view(self):
        factory = RequestFactory()
        request = factory.post('api/v1/cart/add', data={'product': 1, 'default_size': 'Unique', 'session_id': 'test_session'})
        response = views.cart_view(request)
        print(response.data)
