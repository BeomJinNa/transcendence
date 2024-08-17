from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

User = get_user_model()

class TwoFactorCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    code = models.CharField(max_length=6)
    expiration = models.DateTimeField()

    def is_valid(self):
        return timezone.now() < self.expiration