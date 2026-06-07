import email

# Register your models here.
from  django.contrib import admin
from . import models
from django.db import models as djmodels


from django_json_widget.widgets import JSONEditorWidget
from django.db import models as django_models

from django import forms
from .models import Registration, RegFormFieldDef,Profile
from django.contrib.auth.models import User,Permission
from .services import approve_registration

admin.site.register(Permission)
@admin.register(Profile)
class ProfileAdmin(admin.ModelAdmin):
    attr = [f.name for f in Profile._meta.get_fields() if not isinstance(f, (djmodels.OneToOneField, djmodels.ForeignKey))]
    list_display = attr
    search_fields = attr
    list_filter = attr
    ordering = ("id",)



    # Entfernt Buttons die Benutzer Manipulieren können e.t.c
    # def get_form(self, request, obj=None, **kwargs):
    #     form = super().get_form(request, obj, **kwargs)
    #     if "user" in form.base_fields:
    #         form.base_fields["user"].widget.can_add_related = False
    #         form.base_fields["user"].widget.can_change_related = False
    #         form.base_fields["user"].widget.can_delete_related = False
    #         form.base_fields["user"].widget.can_view_related = False
    #     return form
    fieldsets = (
        ("Benutzerdaten", {
            "fields": (
                "user",
                "date_of_birth",
                "role",
                "image",
            )
        }),
        ("Kontaktinformationen", {
            "fields": (
                "street",
                "zip",
                "city",
                "phone",
            )
        }),
    )

@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    attr = [f.name for f in Registration._meta.get_fields()]
    list_display = attr
    search_fields = attr
    list_filter = attr
    ordering = ("-reviewed_at",)
    readonly_fields = ("reviewed_at",)
    fieldsets = (
        ("Persönliche Informationen", {
            "fields": (
                "first_name",
                "last_name",
                "email",
                "date_of_birth",
                "phone",
            )
        }),
        ("Adressinformationen", {
            "fields": (
                "street",
                "house_number",
                "zip",
                "city",
            )
        }),
        ("Administrator-Informationen", {
            "fields": (
                "status",
                "reviewed_at",

                "extra_attributes",
            )
        }),
    )

    def save_model(self, request, obj, form, change):
        super().save_model(request, obj, form, change)

        if change:
            old = Registration.objects.get(pk=obj.pk)

            if old.status != "pending":
                raise ValueError("Registration wurde bereits bearbeitet.")

            # Wenn Status von pending → approved geändert wurde
            elif obj.status == "approved":
                approve_registration(obj)

        else:
            # Neuer Datensatz
            if obj.status == "approved":
                approve_registration(obj)
            elif not obj.status:
                obj.status = "pending"
                obj.save(update_fields=["status"])

class RegFormFieldDefForm(forms.ModelForm):
    class Meta:
        model = RegFormFieldDef
        fields = "__all__"
        exclude=("field_key",)
        widgets = {
            "options": forms.Textarea(
                attrs={
                    "rows": 11,
                    "cols": 61,
                    "placeholder": "Optionen zeilenweise eingeben: value label\nBeispiel:\na b\nc d \noder mit einem Komma trennen \nBeispiel:\na,b \nc d"
                },
            ),
            "error_messages": forms.Textarea(
                attrs={
                    "rows":11,
                    "cols": 61,
                    "placeholder": "Geben Sie die gewünschte Fehlermeldung ein."
                },
            )


        }

@admin.register(RegFormFieldDef)
class RegFormFieldDefAdmin(admin.ModelAdmin):
    form = RegFormFieldDefForm
    attrs = [f.name for f in RegFormFieldDef._meta.get_fields()]
    list_display = attrs
    search_fields = attrs
    list_filter = attrs
    ordering = ("rowIndex","id")



# -------------------User--------------------------
# Einbindung von Profile-Model
# Im Usermodel können auch die Attribute vom Profile
# ausgefüllt werden.
class ProfileInline(admin.StackedInline):
    model = Profile
    fk_name = "user"

class UserAdmin(admin.ModelAdmin):
    inlines = [ProfileInline] # Einbindung Profile
    attr = [f.name for f in User._meta.get_fields() if not isinstance(f, (djmodels.OneToOneField, djmodels.ForeignKey, djmodels.ManyToManyField, djmodels.ManyToOneRel))]
    list_display = ("username", "email", "first_name", "last_name", "is_staff")
    list_filter = attr
    search_fields = attr

    odering = ("username",)
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        ("Persönliche Infos", {"fields": ("first_name", "last_name", "email")}),
        ("Berechtigungen", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
        ("Wichtige Daten", {"fields": ("last_login", "date_joined")}),
    )
admin.site.unregister(User)
admin.site.register(User, UserAdmin)


