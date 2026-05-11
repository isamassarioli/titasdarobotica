from rest_framework import serializers
from .models import Post, Edital
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'first_name', 'last_name', 'email']
        read_only_fields = ['id']


class PostSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    author_id = serializers.IntegerField(write_only=True, required=False)

    class Meta:
        model = Post
        fields = [
            'id', 'title', 'slug', 'category', 'summary', 'body', 'cover_image',
            'status', 'author', 'author_id', 'published_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at', 'author']

    def create(self, validated_data):
        validated_data.pop('author_id', None)
        post = Post.objects.create(**validated_data)
        return post

    def update(self, instance, validated_data):
        validated_data.pop('author_id', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


class EditalSerializer(serializers.ModelSerializer):
    author = UserSerializer(read_only=True)
    author_id = serializers.IntegerField(write_only=True, required=False)
    is_open = serializers.SerializerMethodField()

    class Meta:
        model = Edital
        fields = [
            'id', 'title', 'slug', 'description', 'rules', 'document', 'image',
            'status', 'start_date', 'end_date', 'is_open', 'author', 'author_id',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'created_at', 'updated_at', 'author', 'is_open']

    def get_is_open(self, obj):
        return obj.is_open

    def validate(self, attrs):
        start_date = attrs.get('start_date', getattr(self.instance, 'start_date', None))
        end_date = attrs.get('end_date', getattr(self.instance, 'end_date', None))

        if start_date and end_date and end_date < start_date:
            raise serializers.ValidationError({'end_date': 'Data de término deve ser maior ou igual à data de início.'})

        return attrs

    def create(self, validated_data):
        validated_data.pop('author_id', None)
        edital = Edital.objects.create(**validated_data)
        return edital

    def update(self, instance, validated_data):
        validated_data.pop('author_id', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
