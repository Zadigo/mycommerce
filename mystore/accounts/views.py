from accounts.forms import SignupForm
from django.views.generic import FormView, TemplateView, View
from django.contrib.auth import get_user_model
from django.utils.http import urlsafe_base64_encode, urlencode, urlsafe_base64_decode


class SignupView(FormView):
    form_class = SignupForm
    template_name = 'pages/signup.html'
    success_url = 'http://localhost:5173'
    user_exists_url = ''

    def form_valid(self, form):
        # Retrieve the path the user was initially
        # navigating in order to return him once
        # the signup process is complete
        path = self.request.GET.get('c')
        decoded_path = urlsafe_base64_decode(path)

        email = form.clean_data['email']

        user_model = get_user_model()
        queryset = user_model.objects.filter(email=email)
        if queryset.exists():
            form.ass_error('email', 'Vous avez déjà un compte chez nous')
            return self.form_invalid(form)
        
        params = {
            'first_name': form.cleaned_data['firstname'],
            'last_name': form.cleaned_data['lastname'],
            'email': email
        }
        new_user = user_model.objects.create(**params)
        query = urlencode({
            'login': 1,
            'redirect': decoded_path,
            'u':urlsafe_base64_encode(bytes(str(new_user.pk).encode('utf-8')))
        })
        self.success_url = self.success_url + f'?{query}'
        return super().form_valid(form)


class SignupSuccessView(TemplateView):
    template_name = 'pages/success_url.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['redirect_url'] = 'http://localhost:5173/shop/17'
        return context


class SocialSignupView(View):
    def post(self, request, *args, **kwargs):
        return None
