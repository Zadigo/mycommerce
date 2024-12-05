from accounts.forms import LoginForm
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse, reverse_lazy
from django.shortcuts import redirect
from django.views.generic import FormView, View
from django.utils.decorators import method_decorator
from django.views.decorators.cache import never_cache
from django.views.decorators.debug import sensitive_post_parameters


@method_decorator(never_cache, name='dispatch')
@method_decorator(sensitive_post_parameters('password'), name='dispatch')
class LoginView(FormView):
    form_class = LoginForm
    success_url = reverse_lazy('home')
    template_name = 'pages/login.html'

    def form_valid(self, form):
        email = form.cleaned_data['email']
        password = form.cleaned_data['password']
        user = authenticate(self.request, email=email, password=password)

        backend = 'django.contrib.auth.backends.ModelBackend'
        login(self.request, user, backend=backend)
        return super().form_valid(form)


class LogoutView(View):
    def post(self, request, *args, **kwargs):
        logout(self.reques)
        return redirect(reverse('home'))
