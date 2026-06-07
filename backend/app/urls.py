from rest_framework.routers import DefaultRouter
from django.urls import path,include


from .views import RegFormFieldDefViewSet, UserViewSet,RegistrationViewSet,PermissionViewSet, ProfileViewSet, GroupViewSet  # api_home

router = DefaultRouter()

#Wird von Django automatisch mit migiriert
router.register('users',UserViewSet)
router.register('profile', ProfileViewSet)
router.register('group', GroupViewSet)
router.register('permission', PermissionViewSet)


# basename='registration' erzwingt, dass DRF den internen Routen-Namen registration-list
# und registration-detail verwendet — und nicht user-list doppelt.
router.register(r'registration', RegistrationViewSet, basename="registration")
router.register(r'regformfielddef', RegFormFieldDefViewSet, basename="regformfielddef")

urlpatterns = [
    path('', include(router.urls)),
]