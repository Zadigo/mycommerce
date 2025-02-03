import stripe
from accounts.models import Address, UserProfile
from django.contrib import admin, messages

from mystore.utils import initialize_stripe


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'created_on', 'has_payment_method']
    date_hierarchy = 'created_on'
    search_fields = ['user__email', 'user__first_name', 'user__last_name']
    actions = ['check_stripe_customer_details', 'create_stripe_customer']

    def check_stripe_customer_details(self, request, queryset):
        if len(queryset) > 1:
            messages.error(request, 'Select max 1 product')
            return False

        initialize_stripe()
        userprofile = queryset.get()

        try:
            stripe.Customer.retrieve(userprofile.stripe_id)
        except:
            messages.error(request, "Customer does not exist on Stripe")
        else:
            messages.success(request, 'Customer exists')

    def create_stripe_customer(self, request, queryset):
        if len(queryset) > 1:
            messages.error(request, 'Select max 1 product')
            return False

        initialize_stripe()
        userprofile = queryset.get()

        try:
            data = stripe.Customer.create(
                name=userprofile.user.get_full_name(),
                email=userprofile.user.email,
                phone=userprofile.telephone
            )
        except Exception as e:
            messages.error(request, f'Failed to create customer: {e}')
        else:
            userprofile.stripe_id = data['id']
            userprofile.save()
            messages.success(request, "Customer created in stripe")


@admin.register(Address)
class AddressAdmin(admin.ModelAdmin):
    list_display = [
        'user_profile', 'address_line',
        'zip_code', 'city', 'is_active'
    ]
    search_fields = ['address_line', 'zip_code', 'country']
