from django.urls import reverse_lazy
from django.views.generic import DetailView, FormView

from shop.forms import UploadImagesForm
from shop.models import Image, Product


class ProductView(DetailView):
    """Shows the details for a
    specific given product"""

    model = Product
    queryset = Product.objects.filter(active=True)
    template_name = 'product.html'
    context_object_name = 'product'


class AdminUploadImageView(FormView):
    template_name = 'upload_images.html'
    form_class = UploadImagesForm
    success_url = reverse_lazy('admin:admin_upload_images')

    def form_valid(self, form):
        response = super().form_valid(form)
        # files = self.request.FILES.getlist('images')
        files = form.cleaned_data['images']

        file_name = form.cleaned_data['file_name']
        variant = form.cleaned_data.get('variant')

        objs = []
        for i, file in enumerate(files):
            name = f'{file_name} - {i}'
            
            obj = Image.objects.create(
                name=name,
                variant=variant,
                original=file
            )
            objs.append(obj)
        return response
