import json

from django.contrib.auth.decorators import login_required
from django.contrib.auth import authenticate, login as auth_login, logout as auth_logout
from django.contrib import messages
from django.shortcuts import render, redirect, get_object_or_404
from django.views.decorators.http import require_http_methods
from django.http import JsonResponse

from .forms import RegisterForm




# ---------- Главная ----------
def index(request):
    return render(request, 'main/index.html')


# ---------- Выход ----------
@login_required(login_url='/login/')
def logout_view(request):
    auth_logout(request)
    return redirect('web-login')


# ---------- Вход ----------
def login_view(request):
    if request.method == 'POST':
        username = request.POST.get('username')
        password = request.POST.get('password')
        user = authenticate(request, username=username, password=password)

        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'

        if user is not None:
            auth_login(request, user)
            if is_ajax:
                return JsonResponse({'ok': True, 'redirect': reverse('index')})
            return redirect('index')

        # неверные данные
        if is_ajax:
            return JsonResponse(
                {'ok': False, 'non_field_errors': ['Неверный логин или пароль']},
                status=400,
            )
        messages.error(request, 'Неверный логин или пароль')

    return render(request, 'registration/login.html')


# ---------- Регистрация ----------
from django.urls import reverse   # добавь, если ещё нет

# ---------- Регистрация ----------
def sign_up(request):
    if request.method == 'POST':
        form = RegisterForm(request.POST)
        is_ajax = request.headers.get('X-Requested-With') == 'XMLHttpRequest'

        if form.is_valid():
            user = form.save()
            auth_login(request, user)
            if is_ajax:
                return JsonResponse({'ok': True, 'redirect': reverse('index')})
            return redirect('index')

        # форма невалидна
        if is_ajax:
            return JsonResponse(
                {'ok': False, 'errors': form.errors.get_json_data()},
                status=400,
            )
    else:
        form = RegisterForm()

    return render(request, 'registration/reg.html', {"form": form})


