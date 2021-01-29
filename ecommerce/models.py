from django.db import models

# Create your models here.

class Item(models.Model):
    name = models.CharField(max_length=256)
    price = models.IntegerField()
    code = models.CharField(max_length=3)

    def __str__(self):
        return f"{self.name}"

class PurchasingItem(models.Model):
    item = models.ForeignKey(Item, on_delete=models.CASCADE, related_name="purchasing_item")
    quantity = models.IntegerField(default=1)
    discount = models.FloatField(default=0)

class Cart(models.Model):
    items = models.ManyToManyField(PurchasingItem, related_name="carts", null=True, blank=True)
    total_price = models.FloatField(default=0)