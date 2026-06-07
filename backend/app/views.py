# Django
from django.contrib.auth.models import Permission
from django.utils import timezone
from django.db import models

# DRF
from rest_framework import viewsets, status,filters
from rest_framework.response import Response
from rest_framework.decorators import action
from drf_spectacular.utils import extend_schema, OpenApiResponse
from django_filters.rest_framework import DjangoFilterBackend
from .mixins import AutoFilterViewSet

from .filters import UserFilter, RegistrationFilter, RegFormFieldDefFilter, ProfileFilter
# Lokale Module
from .models import User, Group, Profile, Registration, RegFormFieldDef
from .serializer import (
    UserSerializer,
    GroupSerializer,
    RegistrationSerializer,
    ProfileSerializer, APIErrorSerializer,
    RegFormFieldDefSerializer,
    PermissionSerializer
)
from .services import approve_registration


class RegistrationViewSet(AutoFilterViewSet):
    queryset = Registration.objects.all()
    serializer_class = RegistrationSerializer

    #s. mixins.py AutoFilteViewSet
    model = Registration
    filter_class = RegistrationFilter
    ordering_fields = "__all__"
    # default_order = "last_name"

    # Falls beim Löschen nur inactiv gesetzt werden soll,
    # wird die destroy() überschrieben
    # def destroy(self, request, *args, **kwargs):
    # instance = self.get_object()
    # Soft Delete: nur deaktiveiren
    # instance.is_active = False
    # instance.save()
    # return Response(status=status.HTTP_204_NO_CONTENT)


    # Python liest die Dekoratoren immer von oben nach unten, und der letzte „richtet“ sich
    # dann an die Funktion darunter.
    # Deshalb wird das extend_schema immer nur für die Funktion direkt darunter aktiv.
    @extend_schema(
        description="Approve a pending registration. Creates a User + Profile and marks Registration as approved.",
        responses={
            200: OpenApiResponse(
                response=UserSerializer,
                description="User successfully created"
            ),
            400: OpenApiResponse(
                response=APIErrorSerializer,
                description="Registration was already processed"),
        },
    )
    @action(detail=True, methods=["post"])
    def approve(self, request, pk=None):
        old = Registration.objects.get(pk=pk)

        if old.status != "pending":
            return Response(
                {"detail": "Registration wurde bereits bearbeitet."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Erst dann approven
        user, profile = approve_registration(old)
        return Response(
            {"status": "approved", "user_id": user.id},
            status=status.HTTP_200_OK,
        )


    @extend_schema(
        description="Reject a pending registration. Marks Registration as rejected, no User is created.",
        responses={
            200: OpenApiResponse(description="Registration rejected"),
            400: OpenApiResponse(
                response=APIErrorSerializer,
                description="Registration was already processed"),
        },
    )
    @action(detail=True, methods=["post"])
    def reject(self, request, pk=None):
        registration = self.get_object()

        if registration.status != "pending":
            return Response(
                {"detail": f"Registration ist bereits {registration.status}."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        registration.status = "rejected"
        registration.reviewed_at = timezone.now()
        registration.save(update_fields=["status", "reviewed_at"])

        return Response(
            {"detail": "Registration rejected"},
            status=status.HTTP_200_OK,
        )

class UserViewSet(AutoFilterViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    model = User
    filter_class = UserFilter
    ordering_fields = "__all__"
    # default_order = "username"

class ProfileViewSet(AutoFilterViewSet):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    model = Profile
    filter_class = ProfileFilter
    ordering_fields = "__all__"
    # default_order = "last_name"

class RegFormFieldDefViewSet(AutoFilterViewSet):
    queryset = RegFormFieldDef.objects.all()
    serializer_class = RegFormFieldDefSerializer
    model = RegFormFieldDef
    filter_class = RegFormFieldDefFilter
    ordering_fields = "__all__"
    # default_order = "rowIndex"

class GroupViewSet(AutoFilterViewSet):
    queryset = Group.objects.all()
    serializer_class = GroupSerializer
    model = Group
    ordering_fields = "__all__"

class PermissionViewSet(AutoFilterViewSet):
    queryset = Permission.objects.all()
    serializer_class = PermissionSerializer
    model = Permission
    ordering_fields = "__all__"

