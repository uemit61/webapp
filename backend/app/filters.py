from django.contrib.auth.models import User
from django_filters import rest_framework as filters
from django.db import models
from .models import Profile, Registration, RegFormFieldDef


class BaseFilterSet(filters.FilterSet):
    class Meta:
        abstract = True
        fields = "__all__"

        filter_overrides = {
            models.ImageField: {
                'filter_class': filters.CharFilter,
                'extra': lambda f: {'lookup_expr': 'icontains'},
            },
            models.FileField: {
                'filter_class': filters.CharFilter,
                'extra': lambda f: {'lookup_expr': 'icontains'},
            },
            models.JSONField: {
                'filter_class': filters.CharFilter,
                'extra': lambda f: {'lookup_expr': 'icontains'},
            },
            models.BinaryField: {
                'filter_class': filters.CharFilter,
                'extra': lambda f: {'lookup_expr': 'icontains'},
            },
        }


def make_filterset_for(model):
    field_lookups = {}

    for f in model._meta.get_fields():
        if isinstance(f, (models.CharField, models.TextField)):
                field_lookups[f.name] = ['exact', 'icontains', 'istartswith', 'iendswith']

        elif isinstance(f, models.BooleanField):
            field_lookups[f.name] = ['exact']

        elif isinstance(f, (models.DateField, models.DateTimeField)):
            field_lookups[f.name] = ['exact', 'gte', 'lte', 'range']


        elif isinstance(f, (models.IntegerField, models.DecimalField, models.FloatField)):
            field_lookups[f.name] = ['exact', 'gte', 'lte', 'range']


        elif isinstance(f, models.ForeignKey):
            field_lookups[f.name] = ['exact', 'in']


        elif isinstance(f, models.ManyToManyField):
            field_lookups[f.name] = ['in']


        elif isinstance(f, (models.FileField, models.ImageField, models.JSONField, models.BinaryField)):
            field_lookups[f.name] = ['exact', 'icontains']


    Meta = type(
        "Meta",
        (BaseFilterSet.Meta,),
        {
            "model": model,
            "fields": field_lookups,
        }
    )

    # FilterSet sınıfını döndür
    return type(f"{model.__name__}Filter", (BaseFilterSet,), {"Meta": Meta})

UserFilter = make_filterset_for(User)
ProfileFilter = make_filterset_for(Profile)
RegistrationFilter = make_filterset_for(Registration)
RegFormFieldDefFilter = make_filterset_for(RegFormFieldDef)

