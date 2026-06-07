from fileinput import filename

from django.contrib.auth.models import User, Group
from django.db import models
import json

#Quasi Utils
def get_default_role():
    # from .models import Role # könnte sein das Role nicht im Speicher ist (ImportError)
    return Group.objects.get_or_create(name="users")[0].id

def upload_to(instance, filename):
    return  f'images/{filename}'.format(filename=filename)

class RegFormFieldDef(models.Model):
    FORM_FIELD_TYPES = [
        ("text", "Text"),
        ("email", "Email"),
        ("password", "Password"),
        ("tel", "Telefon"),
        ("number", "Number"),
        ("date", "Date"),
        ("datetime-local", "Datetime Local"),
        ("time", "Time"),
        ("url", "URL"),
        ("color", "Color"),
        ("range", "Range"),
        ("file", "File"),
        ("select", "Select"),
        ("checkbox", "Checkbox"),
        ("radio", "Radio"),
        ("textarea", "Textarea"),
    ]

    SIZES = [
        ("w-1/2","w-1/2"),
        ("w-1/3","w-1/3"),
        ("w-2/3","w-2/3"),
        ("w-1/4","w-1/4"),
        ("w-3/4","w-3/4"),
        ("w-1/5","w-1/5"),
        ("w-2/5","w-2/5"),
        ("w-3/5","w-3/5"),
        ("w-4/5","w-4/5"),
        ("w-1/6","w-1/6"),
        ("w-5/6","w-5/6"),
        ("w-full","w-full")
    ]

    rowIndex = models.IntegerField(default=1)
    # form_name = models.CharField(max_length=100) später wenn Dashboard erweitert wird
    # form_page = models.PositiveIntegerField(default=1) später ...
    field_type = models.CharField(max_length=50, choices=FORM_FIELD_TYPES)

    field_id = models.CharField(max_length=100)
    label = models.CharField(max_length=200)
    required = models.BooleanField(default=False)
    size = models.CharField(max_length=50, default="w-full", choices=SIZES)

    max_length = models.PositiveIntegerField(null=True, blank=True)
    min_length = models.PositiveIntegerField(null=True, blank=True)
    error_messages = models.TextField(null=True, blank=True)

    options = models.TextField(null=True, blank=True)

    field_key = models.CharField(max_length=100)

    extra_class_attributes = models.CharField(null=True,default="", blank=True)

    def clean(self):
        from django.core.exceptions import ValidationError


        # Sicherstellen: options nur bei Selects gesetzt
        if self.field_type == "select" and not self.options:
            raise ValidationError("Options sind erforderlich für Select-Felder.")


        # Höchstens 3 Inputs pro Zeile
        same_row = RegFormFieldDef.objects.filter(rowIndex=self.rowIndex) # alle Input in Zeile rowIndex
        if self.pk:
            same_row = same_row.exclude(pk=self.pk)

        if same_row.count() >= 3: # Es wird gezählt ob schon zwei Inputs in der Zeile vorhanden sind
            raise ValidationError(
                {"rowIndex": f"Fehler (Zeile: {self.rowIndex}):  In eine Zeile  dürfen höchstens 3 (drei) Inputs vergeben werden."}
            )

    def save(self, *args, **kwargs):

        if self.options and isinstance(self.options, str):
            try:
                json.loads(self.options)
            except (ValueError, TypeError):
                lines = [
                    line.strip()
                    for line in self.options.replace(";", "\n").splitlines()
                    if line.strip()
                ]
                parsed = []
                for line in lines:
                    parts = [p.strip() for p in line.replace(",", " ").split() if p.strip()]
                    if len(parts) >= 2:
                        parsed.append({"value": parts[0], "label": parts[1]})
                # 🔹 JSON als String speichern (DB-Feld ist TextField)
                self.options = json.dumps(parsed, ensure_ascii=False, indent=2)

        if self.field_id and isinstance(self.field_id, str):
            self.field_key = f"extra_attributes.{self.field_id}"

        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.field_id}: {self.label} ({self.field_type})"

    class Meta:
        ordering = ["rowIndex", "id"]


class Registration(models.Model):
    STATUS_CHOICES = [
        ('pending', 'ausstehend'),
        ('approved', 'genehmigt'),
        ('rejected', 'abgelehnt'),
    ]

    # auth_user (Django-User )
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50,default="")
    email = models.EmailField()

    # app_profile (1 zu 1 Zusatz zum Django-User s.U)
    name_bondsman = models.CharField(max_length=50)
    street = models.CharField(max_length=100)
    house_number= models.CharField(max_length=10)
    zip = models.CharField(max_length=10)
    city = models.CharField(max_length=50)
    date_of_birth = models.DateField(default='1900-01-01')
    date_of_registration = models.DateField(default='1900-01-01')
    phone = models.CharField(max_length=20)
    signature = models.BinaryField(null=True, blank=True)
    signature_bondsman = models.BinaryField(null=True, blank=True)

    # Admin-Workflow
    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='pending',
    )
    created_at = models.DateTimeField(auto_now_add=True)
    reviewed_at = models.DateTimeField(null=True, blank=True)

    # Extrafelder vom Admin hinzugefügt
    extra_attributes = models.JSONField(null=True, blank=True)


# Dies entspricht dem vorgfertigtem Django-Model Group
# class Role(models.Model):
#     name = models.CharField(max_length=50,unique=True)
#     #description = models.TextField()
#     def __str__(self):
#         return self.name


#Zusatzinformationen zum Django-User 1 zu 1 verknüpft
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE,related_name='profile')
    emailVerified = models.DateTimeField(auto_now=True)
    image = models.ImageField(upload_to=upload_to,blank=True, null=True)
    street = models.CharField(max_length=100)
    zip = models.CharField(max_length=10)
    city = models.CharField(max_length=50)


    role = models.ForeignKey(
                Group,
                on_delete=models.PROTECT,
                null=True,
                blank=True, #Wenn nichts vom Client übergeben wurde,
                default=get_default_role
            )
    phone = models.CharField(max_length=20, blank=True)
    date_of_birth = models.DateField(default='1900-01-01')
    createdAt = models.DateTimeField(auto_now_add=True)
    updatedAt = models.DateTimeField(auto_now=True)
    extra_attributes = models.JSONField(null=True, blank=True)


    # Überschreiben der save(). *args,**kwarg  mit übergeben wichtig
    # damit alle Parameter erhalten bleiben, super().save(....
    def save(self, *args, **kwargs):
        if self.role is None or not self.role:
            # Rolle "users" aus DB holen oder erstellen
            self.role = get_default_role()
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.username} ({self.user.email})"