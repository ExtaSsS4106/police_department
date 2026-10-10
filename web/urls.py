from django.urls import path
from . import views

urlpatterns = [
    # --- основные ---
    path('',         views.index,       name='index'),

    # --- auth ---
    path('login/',   views.login_view,  name='web-login'),
    path('logout/',  views.logout_view, name='web-logout'),
    path('signup/',  views.sign_up,     name='web-signup'),

]