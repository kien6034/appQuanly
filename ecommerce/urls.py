from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("API/addItem", views.addItemAPI, name = "addItemApi"),
    path("API/updateQuantity", views.updateQuantity, name = "update_quantity"),
    path("checkout", views.checkout, name = "checkout")
]