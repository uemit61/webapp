# backend/app/mixins.py
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters, viewsets
from django.db import models


class AutoFilterViewSet(viewsets.ModelViewSet):
    model = None
    filter_class = None
    default_order = "id"

    # Sobald eine Klasse mit die als Parameter AutoFilterViewSet
    # hat, erzeugt wird, wird dies Ausgeführt. Siehe views.py
    @classmethod
    def __init_subclass__(cls):
        super().__init_subclass__()

        if cls.model is None or cls.filter_class is None:
            return

        cls.filter_backends = [
            DjangoFilterBackend,
            filters.OrderingFilter,
            filters.SearchFilter,
        ]

        cls.filterset_class = cls.filter_class

        all_fields = sorted([f.name for f in cls.model._meta.get_fields() if not isinstance(f, (models.OneToOneField, models.ForeignKey, models.ManyToManyField,models.ManyToOneRel))])
        fields = [
            f.name for f in cls.model._meta.get_fields()
            if not isinstance(f, (models.OneToOneField, models.ForeignKey, models.ManyToManyField,models.ManyToOneRel))
            if f.concrete
        ]

        ekistra_fields=[
            f"{f.name}__{ef.name}" for f in cls.model._meta.get_fields()
            if isinstance(f,(models.OneToOneField,models.ForeignKey))
            for ef in f.remote_field.model._meta.get_fields()
            if not isinstance(ef, (models.OneToOneField, models.ForeignKey, models.ManyToManyField, models.ManyToOneRel))
            if ef.concrete
        ]

        extra_fields = [
            f"{f.get_accessor_name()}__{ef.name}"
            for f in cls.model._meta.get_fields()
            if isinstance(f, (models.OneToOneRel, models.ManyToManyRel))
               and getattr(f, "related_model", None) is not None
               and getattr(f, "get_accessor_name", None) is not None
            for ef in f.related_model._meta.get_fields()
            if ef.concrete
               and not isinstance(ef, (models.OneToOneField, models.ForeignKey, models.ManyToManyField,
                                       models.ManyToOneRel))
        ]

        print(ekistra_fields)
        cls.filterset_fields = all_fields
        cls.ordering_fields = all_fields
        cls.ordering = [cls.default_order]
        cls.search_fields = fields+ekistra_fields+extra_fields
