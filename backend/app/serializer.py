from django.contrib.auth.models import Permission
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import User,Group, Registration, Profile,RegFormFieldDef
from .utils.crypto import encrypt_signature, decrypt_signature
import base64
import json


class APIErrorSerializer(serializers.Serializer):
    detail = serializers.CharField(help_text="Fehlermeldung")


class ProfileSerializer(serializers.ModelSerializer):
    role=serializers.SlugRelatedField(
        queryset=Group.objects.all(),
        slug_field='name',
        required=False
    )

    class Meta:
        model = Profile
        fields = '__all__'
        read_only_fields = ['createdAt', 'updatedAt']

class RegFormFieldDefSerializer(serializers.ModelSerializer):
    options = serializers.SerializerMethodField()
    class Meta:
        model = RegFormFieldDef
        fields = '__all__'

    def get_options(self, obj):
        if not obj.options:
            return []
        if isinstance(obj.options, str):
            try:
                return json.loads(obj.options)
            except json.JSONDecodeError:
                return []
        return obj.options

    def get_error_message(self, obj):
        if not obj.error_messages:
           return []
        if isinstance(obj.error_messages, str):
            try:
                return json.loads(obj.error_messages)
            except json.JSONDecodeError:
                return []
        return obj.error_messages

class RegistrationSerializer(serializers.ModelSerializer):
    #Basis-Check kann überschrieben werden
    # Für einen zusätzliche eigenen Check   in die Meta-Klasse schreiben
    # Beides läuft erst Basis danach Meta
    email = serializers.EmailField(required=True) #Basis-Check
    signature = serializers.CharField(write_only=True, required=False)
    signature_bondsman = serializers.CharField(write_only=True, required=False)


    class Meta:
        model = Registration
        fields = '__all__'

    # def get_signature(self, obj):
    #     if obj.signature:
    #         return f"data:image/png;base64,{base64.b64encode(decrypt_signature(obj.signature)).decode()}"
    #
    # def get_signature_bondsman(self, obj):
    #     if obj.signature_bondsman:
    #         return f"data:image/png;base64,{base64.b64encode(decrypt_signature(obj.signature_bondsman)).decode()}"
    #
    def create(self, validated_data):
        signature = validated_data.pop('signature',None)
        signature_bondsman = validated_data.pop('signature_bondsman', None)

        if signature:
            sign_bytes = base64.b64decode(signature.split(',')[1])
            validated_data['signature'] = encrypt_signature(sign_bytes)

        if signature_bondsman:
            bondsman_bytes = base64.b64decode(signature_bondsman.split(',')[1])
            validated_data['signature_bondsmand'] = encrypt_signature(bondsman_bytes)

        return super().create(validated_data)

class UserSerializer(serializers.ModelSerializer):
    password = \
        (
            serializers.CharField
                (
                write_only=True,
                min_length=8,
                max_length=128,
                style={'input_type': 'password'},
                required =False
            )
        )

    email = serializers.EmailField(required=True)
    profile = ProfileSerializer()

    class Meta:
        model = User
        fields = '__all__'



    #Validerung für einzelne Felder (field)
    #Bei fehlerhafter Validerung wird VallidationError
    #ausgegeben, die create()-Fkt wird nicht ausgeführt
    #Reihenfolge erst die einzelnen Felder validieren,
    #danach die alle Felder, und danach create() od. update()

    #Einzelne Felder validieren
    #def validate_<field>(self, value):
        #Todo  if--->raise--->Error
        #return value
    #Bsp.:
    def validate_password(self, value):
        validate_password(value)
        return value

    #Alle Felder validieren
    #def validate(self, attrs):
        #Todo  if--->raise--->Erorr
        #return attrs

    #create() wird nach validate() od. validate_<field> ausgeführt
    #Es geht nicht mehr darum, ob die Daten korrekt sind,
    #sondern wie sie gespeichert werden.

    def create(self,validated_data):
        #Passwort gehasht speichern // Nicht mehr nötig mit Django-User
        # if 'password' in validated_data:
        #     validated_data['passwordHash'] = make_password(validated_data['password'])

        # Password und profile werden gepoppt und beim create_user() wird password erneut eingeführt
        # somit folgt ein set_password(password), dass automatisch das
        # Passwort hasht.
        profile_data = validated_data.pop('profile', {})
        password = validated_data.pop('password')

        user = User.objects.create_user(password=password,**validated_data)


        Profile.objects.create(user=user,**profile_data)
        user.is_active = True
        user.is_staff = False
        user.is_superuser = False
        user.user_permissions.clear()
        user.save()
        return user

    # instance ist das DB-Objekt  wird mit validated_data aktualisiert
    # Alle setattr(instance, attr, value)  instance.save
    def update(self, instance, validated_data):
        profile_data = validated_data.pop('profile', {})

        password = validated_data.pop('password',None)

        if password:
            instance.set_password(password)

        instance =  super().update(instance, validated_data)

        profile = instance.profile
        for attr, value in profile_data.items():
            if value is not None:
                setattr(profile, attr, value)
        profile.save()

        return instance


class GroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = Group
        fields = '__all__'


class PermissionSerializer(serializers.ModelSerializer):
    model = serializers.CharField(source="content_type.model")
    class Meta:
        model = Permission
        fields = '__all__'

