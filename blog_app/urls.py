from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, EditalViewSet

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'editals', EditalViewSet, basename='edital')

app_name = 'blog_app'

urlpatterns = [
    path('', include(router.urls)),
]
