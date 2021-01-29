from django.shortcuts import render, redirect, get_object_or_404
from django.http import HttpResponse, JsonResponse
import json
from .models import *

# Create your views here.

def home(request):
    cart = Cart.objects.last()

    items = cart.items.all()
    context = {
        "cart": cart,
        "items": items
    }
    return render(request, "ecommerce/home.html", context = context)


def addItemAPI(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        value = data['value']
        
        try:
            item = Item.objects.get(code = value.upper())
        except:
            item = None
            return HttpResponse("404")
        
        #lay gio hang cuoi cung
        cart = Cart.objects.last()

        #tao purchasing item
        pItem = PurchasingItem.objects.create(item = item, quantity=1)

        #kiem tra code co tron don hang chua
        for pitem in cart.items.all():
            if value.upper() == pitem.item.code:
                return HttpResponse("Existed")

        #neu item khong co trong cart 
        if pItem not in cart.items.all():
            #them purchasing item vao cart
            cart.items.add(pItem)
        else:
            print('hey')
            return JsonResponse({'state': False})

        data = {
            'code': item.code,
            'name': item.name,
            'price': item.price,
            'id': pItem.id
        }
        
        return JsonResponse(data)
 

    #LUU VAO SERVER
    return HttpResponse(value)


def updateQuantity(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        
        itemId = data['itemId']
        updateType = data['type']

        try:
            purchasingItem = PurchasingItem.objects.get(id = int(itemId))
        except:
            return HttpResponse("404")
        

        if updateType == "plus":
            purchasingItem.quantity += 1
        else:
            if purchasingItem.quantity == 1:
                #DELETE
                purchasingItem.delete()
                return HttpResponse("0")
            purchasingItem.quantity -=1 

        purchasingItem.save()

    return HttpResponse(purchasingItem.quantity)


def checkout(request):
    cart = Cart.objects.last()

    #calculate total price
    total = 0
    for pitem in cart.items.all():
        total += pitem.item.price * pitem.quantity
    
    cart.total_price = total
    
    cart.save()

    context = {
        "cart": cart
    }

    #create new cart
    newCart = Cart.objects.create()

    return render(request, "ecommerce/checkout.html", context = context)