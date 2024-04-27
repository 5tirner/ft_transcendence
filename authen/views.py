from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from .forms import SignupForm, LoginForm
from django.http import HttpResponse
import requests

# def login_42(request):
#     # Redirect the user to 42's OAuth authorization URL
#     redirect_uri = 'http://localhost:8000/callback/'  # Change this to your callback URL
#     client_id = 'u-s4t2ud-276587daed10a1e33fcfbc113f9d4e97933508f4d8bb753cd1e7b49a31a00cb9'
#     authorization_url = f'https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code'
#     return redirect(authorization_url)

def login(request):
    if request.method == 'GET':
        # Redirect the user to 42's OAuth authorization URL
        redirect_uri = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-276587daed10a1e33fcfbc113f9d4e97933508f4d8bb753cd1e7b49a31a00cb9&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000&response_type=code'  # Change this to your callback URL
        client_id = 'u-s4t2ud-276587daed10a1e33fcfbc113f9d4e97933508f4d8bb753cd1e7b49a31a00cb9'
        authorization_url = f'https://api.intra.42.fr/oauth/authorize?client_id={client_id}&redirect_uri={redirect_uri}&response_type=code'
        return redirect(authorization_url)
    elif request.method == 'POST':
        form = LoginForm(request.POST)
        if form.is_valid():
            username = form.cleaned_data['username']
            password = form.cleaned_data['password']
            user = authenticate(request, username=username, password=password)
            if user:
                login(request, user)
                return redirect('home')
    else:
        form = LoginForm()
    context = {
        'title': 'Login',
        'form': form,
    }
    return render(request, 'LoginPage/index.html', context)

def callback_42(request):
    # This view handles the callback after the user authorizes your application
    code = request.GET.get('code')
    if code:
        # Exchange the authorization code for an access token
        client_id = 'u-s4t2ud-276587daed10a1e33fcfbc113f9d4e97933508f4d8bb753cd1e7b49a31a00cb9'
        client_secret = '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'
        redirect_uri = 'https://api.intra.42.fr/oauth/authorize?client_id=u-s4t2ud-276587daed10a1e33fcfbc113f9d4e97933508f4d8bb753cd1e7b49a31a00cb9&redirect_uri=http%3A%2F%2F127.0.0.1%3A8000&response_type=code'  # Change this to your callback URL
        token_url = 'https://api.intra.42.fr/oauth/token'
        payload = {
            'grant_type': 'authorization_code',
            'client_id': client_id,
            'client_secret': client_secret,
            'code': code,
            'redirect_uri': redirect_uri
        }
        response = requests.post(token_url, data=payload)
        if response.status_code == 200:
            # Access token obtained successfully, you can now use it to make requests to the 42 API
            access_token = response.json()['access_token']
            # Store the access token securely, e.g., in session or database
            request.session['access_token'] = access_token
            # Redirect the user to a protected page
            return redirect('home')
        else:
            # Handle error response
            return HttpResponse("Failed to obtain access token")
    else:
        # Handle case where code is missing
        return HttpResponse("Authorization code missing")


def home(request):
    return render(request, 'LoginPage/home.html')

def user_signup(request):
    if request.method == 'POST':
        form = SignupForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('login')
    else:
        form = SignupForm()
    return render(request, 'LoginPage/signup.html', {'form': form})

# def user_login(request):
#     if request.method == 'POST':
#         form = LoginForm(request.POST)
#         if form.is_valid():
#             username = form.cleaned_data['username']
#             password = form.cleaned_data['password']
#             user = authenticate(request, username=username, password=password)
#             if user:
#                 login(request, user)
#                 return redirect('home')
#     else:
#         form = LoginForm()
#     context = {
#         'title': 'Login',
#         'form': form,
#     }
#     # print('YW HNA TA7 RYAL AYW HNA LA3BO 3LIH')
#     return render(request, 'LoginPage/index.html', context)

def user_logout(request):
    logout(request)
    return redirect('login')
