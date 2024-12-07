from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from api.views import login_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/login/', login_view, name='login')
]
