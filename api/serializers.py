from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import *

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    role = serializers.CharField(required=False, default='user') 
    
    class Meta:
        model = User
        fields = ('username', 'password', 'password2', 'email', 'first_name', 'last_name', 'role')

    def validate(self, attrs):
        username = attrs["username"]
        if User.objects.filter(username__iexact=username).exists():
            raise serializers.ValidationError({"username":"Пользователь с таким именем уже существует."})
        email = attrs["email"]
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError({"username":"Пользователь с таким email уже существует."})
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Пароли не совпадают"})
        return attrs

    def create(self, validated_data):
        role = validated_data.get('role', 'user')
        
        is_superuser = (role == 'admin')
        
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            is_superuser=is_superuser,
            is_staff=is_superuser,         
            is_active=True 
        )
        user.set_password(validated_data['password'])
        user.save()
        
        profiles.objects.create(user=user, role=validated_data.get('role', ''))
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'date_joined')