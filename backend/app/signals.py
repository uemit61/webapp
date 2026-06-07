#Nach der Migration der Models in die DB werden,
#vordefinierte Datensätze in die Models geschrieben,
#z.B.: (s.U) Es wreden die Rolen "user" und "admin" erstellt,
#wenn nicht vorhanden.

# Damit alles klappt muss AppConfig (apps.py) erweitert werden.

from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Group


@receiver(post_migrate)
def create_default_roles(sender, **kwargs):
    if sender.name == "app":  # deine App einsetzen
        Group.objects.get_or_create(name="users")
        Group.objects.get_or_create(name="admins")