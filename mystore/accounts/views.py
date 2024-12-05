from accounts.forms import LoginForm
from django.contrib.auth import authenticate, login, logout
from django.urls import reverse, reverse_lazy
from django.shortcuts import HttpResponseRedirect, redirect
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
    
    def get_success_url(self):
        if next_url := self.request.GET.get('next'):
            return HttpResponseRedirect(next_url)
        return super().get_success_url()

    def form_valid(self, form):
        email = form.cleaned_data['email']
        password = form.cleaned_data['password']
        user = authenticate(self.request, username=email, password=password)

        if user is None:
            form.add_error('email', 'Account is not valid')
            return super().form_invalid(form)

        backend = 'django.contrib.auth.backends.ModelBackend'
        login(self.request, user, backend=backend)
        return super().form_valid(form)


class LogoutView(View):
    def get(self, request, *args, **kwargs):
        logout(request)
        return redirect(reverse('home'))
