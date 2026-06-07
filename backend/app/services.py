
from .models import Registration, Profile
from django.contrib.auth.models import User
from django.utils import timezone

def approve_registration(registration: Registration):
    # Nach der Genehmigung wird ein neuer User mit einem erweiterten
    # Profil angelegt.
    user, created = User.objects.get_or_create(
        username=registration.email,
        defaults={
            "email": registration.email,
            "first_name": registration.first_name,
            "last_name": registration.last_name,
        },
    )

    profile, _ = Profile.objects.get_or_create(
        user=user,
        defaults={
            "date_of_birth": registration.date_of_birth,
            "street": registration.street,
            "zip": registration.zip,
            "city": registration.city,
        },
    )

    if registration.extra_attributes:
        for key, value in registration.extra_attributes.items():
                profile.extra_attributes[key] = value
        profile.save()

    # 4. Registrierung updaten
    registration.status = "approved"
    registration.reviewed_at = timezone.now()
    registration.save(update_fields=["status", "reviewed_at"])

    return user, profile
