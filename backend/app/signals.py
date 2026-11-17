#Nach der Migration der Models in die DB werden
#vordefinierte Datensätze in die Models geschrieben,
#z.B.: (s.U) es werden die Rollen "users" und "admins" erstellt,
#wenn nicht vorhanden.

# Damit alles klappt, muss AppConfig (apps.py) erweitert werden.

from django.db.models.signals import post_migrate
from django.dispatch import receiver
from .models import Group


@receiver(post_migrate)
def create_default_roles(sender, **kwargs):
    if sender.name == "app":
        Group.objects.get_or_create(name="users")
        Group.objects.get_or_create(name="admins")