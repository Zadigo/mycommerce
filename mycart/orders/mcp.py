import pandas
from django.contrib.auth import get_user_model
from django.core.cache import cache
from django.db import models
from django.utils import timezone
from django_mcp import mcp_app as mcp
from mcp.server.fastmcp import Context
from mcp_server import MCPToolset, ModelQueryToolset
from orders.api.serializers import CustomerOrderSerializer
from orders.models import CustomerOrder, Product


class UserQueryTool(ModelQueryToolset):
    model = get_user_model()
    search_fields = [
        'first_name',
        'last_name',
        'email'
    ]


class ProductQueryTool(ModelQueryToolset):
    model = Product
    search_fields = [
        'reference',
        'serialized_data',
        'unit_price',
        'customer_order',
        'created_on',
    ]

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.prefetch_related('customer_order').all()


class CustomerOrderQueryTool(ModelQueryToolset):
    model = CustomerOrder
    search_fields = [
        'reference',
        'user__email',
        'user__first_name',
        'user__last_name',
        'address',
        'city',
        'zip_code',
        'country',
        'total',
        'notes',
        'completed',
        'refund_requested',
        'stock_updated',
        'return_delay',
        'max_return_delay',
        'created_on'
    ]

    def get_queryset(self):
        qs = super().get_queryset()
        return qs.prefetch_related('user').all()


class CustomOrderTools(MCPToolset):
    def _get_queryset(self, force_refresh: bool = False):
        qs = cache.get('mcp_customer_orders')
        if qs is None or force_refresh:
            qs = CustomerOrder.objects.prefetch_related('user')
            cache.set('mcp_customer_orders', qs, timeout=60 *
                      60 * 24)  # Cache for 24 hours
        return qs.all()

    def get_order(self, reference: str, email: str = None) -> dict:
        """Returns the details of a customer order based on its reference number.

        Args:
            reference (str): The reference number of the customer order.
            email (str, optional): The email of the customer. Defaults to None.

        Returns:
            dict: A dictionary containing the details of the customer order, or None if no order is found with the given reference number.
        """
        qs = self._get_queryset(force_refresh=True)

        if email is not None:
            qs = qs.filter(user__email=email)

        try:
            order = qs.get(reference=reference)
        except CustomerOrder.DoesNotExist:
            return None

        return CustomerOrderSerializer(instance=order).data

    def get_by_total(self, min_total: float = None, max_total: float = None) -> list[dict]:
        """Returns a list of customer orders that have a total within the specified range.

        Args:
            min_total (float, optional): The minimum total of the customer orders to be returned. Defaults to None, which means no minimum total.
            max_total (float, optional): The maximum total of the customer orders to be returned. Defaults to None, which means no maximum total.

        Returns:
            list: A list of dictionaries, each containing the details of a customer order that has a total within the specified range.
        """
        qs = self._get_queryset()

        if min_total is not None:
            qs = qs.filter(total__gte=min_total)

        if max_total is not None:
            qs = qs.filter(total__lte=max_total)

        return CustomerOrderSerializer(instance=qs, many=True).data

    def get_by_refund_requested(self, refund_requested: bool = True) -> list[dict]:
        """Returns a list of customer orders that have a refund requested status matching the specified value.

        Args:
            refund_requested (bool, optional): The refund requested status of the customer orders to be returned. Defaults to True.

        Returns:
            list: A list of dictionaries, each containing the details of a customer order that has a refund requested status matching the specified value.
        """
        qs = self._get_queryset(force_refresh=True)
        qs = qs.filter(refund_requested=refund_requested)
        return CustomerOrderSerializer(instance=qs, many=True).data

    # async def refund_customers(self, order_reference: str):
    #     data = await mcp.call_tool('get_by_refund_requested', refund_requested=True)

    def get_return_delay(self, order_reference: str):
        pass

    def update_order(self, order_reference: str, **kwargs):
        pass

    def email_customer(self, email: str, subject: str, message: str):
        pass

    def transfer_to_external_crm(self, crm_name: str, from_date: str = None, to_date: str = None) -> dict[str, str]:
        """Transfers customer orders to an external CRM system.

        Args:
            crm_name (str): The name of the CRM system to transfer the customer orders to.
            from_date (str, optional): The start date for filtering customer orders to be transferred. Defaults to None, which means no start date.
            to_date (str, optional): The end date for filtering customer orders to be transferred. Defaults to None, which means no end date.

        Returns:
            dict: A dictionary containing the status and message of the transfer operation.
        """
        available_crms = {
            'salesforce': None,
            'hubspot': None,
            'zoho': None,
            'airtable': None,
        }

        if crm_name not in available_crms:
            raise ValueError(
                f'CRM "{crm_name}" is not supported. Available CRMs: {available_crms}'
            )

        qs = self._get_queryset()

        if from_date is not None:
            qs = qs.filter(created_on__gte=from_date)

        if to_date is not None:
            qs = qs.filter(created_on__lte=to_date)

        instance = available_crms[crm_name]

        if instance is None:
            raise NotImplementedError(
                f'Integration with CRM "{crm_name}" is not implemented yet.'
            )

        for chunk in qs.iterator(chunk_size=100):
            # Transform the chunk of customer orders into the format required by the CRM
            data = self._transform_for_crm(chunk, crm_name)

            # Send the data to the CRM
            instance.send_data(data)

        return {
            'status': 'success',
            'message': f'Customer orders transferred to CRM "{crm_name}" successfully.'
        }

    def get_orders_for_this_month(self) -> list[dict]:
        """Returns a list of customer orders that were created in the current month.

        Returns:
            list: A list of dictionaries, each containing the details of a customer order that was created in the current month.
        """
        qs = self._get_queryset()

        current_month = timezone.now().month
        current_year = timezone.now().year

        qs = qs.filter(
            created_on__year=current_year,
            created_on__month=current_month
        )

        return CustomerOrderSerializer(instance=qs, many=True).data

    def get_orders_for_this_week(self) -> list[dict]:
        """Returns a list of customer orders that were created in the current week.

        Returns:
            list: A list of dictionaries, each containing the details of a customer order that was created in the current week.
        """
        qs = self._get_queryset(force_refresh=True)
        current_week = timezone.now().isocalendar()[1]
        current_year = timezone.now().year

        qs = qs.filter(
            created_on__year=current_year,
            created_on__week=current_week
        )

        return CustomerOrderSerializer(instance=qs, many=True).data

    def cancel_order(self, order_reference: str):
        pass

    def number_of_orders_by_country(self):
        pass

    def number_of_orders_by_city(self):
        pass

    def average_order_value(self):
        """Returns the average order value of all customer orders.

        Returns:
            float: The average order value of all customer orders.
        """
        qs = self._get_queryset()

        total_sales = qs.aggregate(models.Sum('total'))['total__sum'] or 0
        total_orders = qs.count()

        average_value = total_sales / total_orders if total_orders > 0 else 0
        return average_value

    def top_selling_products(self, top_n: int = 5):
        pass

    def get_comparision_current_year_previous_year(self, base_year: int = None, other_year: int = None):
        """Returns a comparision of orders between the current year and either the previous year or a specified year,
        including total sales, average order value, and number of orders.

        Args:
            base_year (int, optional): The year to compare against. Defaults to None, which means the current year.
            other_year (int, optional): The year to compare with. Defaults to None, which means the previous year.

        Returns:
            dict: A dictionary containing the comparision of orders between the current year and the previous year or specified year.
        """
        current_year = base_year or timezone.now().year
        previous_year = other_year or current_year - 1

        qs = self._get_queryset()

        qs_current_year = qs.filter(created_on__year=current_year)
        qs_previous_year = qs.filter(created_on__year=previous_year)

        fields = ['id', 'created_on', 'total']
        df_current_year = pandas.DataFrame(
            list(qs_current_year.values(*fields)))
        df_previous_year = pandas.DataFrame(
            list(qs_previous_year.values(*fields)))

        stats_current_year = df_current_year.describe().to_dict()
        stats_previous_year = df_previous_year.describe().to_dict()

        return {
            'current_year': stats_current_year,
            'previous_year': stats_previous_year
        }

    def get_statistcs_of_orders_this_month(self):
        """Returns statistics of orders for the current month, 
        including total sales, average order value, and number of orders.

        Returns:
            dict: A dictionary containing the statistics of orders for the current month.
        """
        current_month = timezone.now().month
        current_year = timezone.now().year

        qs = self._get_queryset()
        qs = qs.filter(created_on__year=current_year,
                       created_on__month=current_month)
        df = pandas.DataFrame(list(qs.values('id', 'created_on', 'total')))

        return df.describe().to_dict()

    def statistcs_of_orders_this_year(self):
        """Returns statistics of orders for the current year, 
        including total sales, average order value, and number of orders.

        Returns:
            dict: A dictionary containing the statistics of orders for the current year.
        """
        current_year = timezone.now().year

        qs = self._get_queryset()
        qs = qs.filter(
            created_on__year=current_year,
            refund_requested=False
        )

        df = pandas.DataFrame(list(qs.values('id', 'created_on', 'total')))
        return df.describe().to_dict()['total']

    def statistcs_of_orders_this_quarter(self, quarter: int) -> dict:
        """Returns statistics of orders for the specified quarter of the current year,
        including total sales, average order value, and number of orders.

        Args:
            quarter (int): The quarter for which to retrieve the statistics (1, 2, 3, or 4).

        Returns:
            dict: A dictionary containing the statistics of orders for the specified quarter of the current year.
        """
        qs = self._get_queryset()
        qs_current_quarter = qs.filter(created_on__quarter=quarter)
        values = qs_current_quarter.values('id', 'created_on', 'total')
        df = pandas.DataFrame(list(values))
        return df.describe().to_dict()['total']

    def statistcs_of_orders_this_semester(self, semester: int):
        pass

    def statistics_of_orders_this_week(self):
        pass

    def get_monthly_statistics(self):
        current_year = timezone.now().year
        qs = self._get_queryset()
        qs = qs.filter(created_on__year=current_year)
        df = pandas.DataFrame(list(qs.values('id', 'created_on', 'total')))
        df['created_on'] = pandas.to_datetime(df['created_on'])
        monthly_stats = df.resample('M').agg(
            {
                'total': ['sum', 'mean', 'count']
            }
        )
        monthly_stats.columns = ['total_sum', 'average_total', 'order_count']
        return monthly_stats


@mcp.prompt('sync_customers_with_google_ads')
async def sync_customers_with_google_ads(ctx: Context):
    pass


@mcp.prompt('sync_orders_with_facebook_ads')
async def sync_orders_with_facebook_ads(ctx: Context):
    pass
