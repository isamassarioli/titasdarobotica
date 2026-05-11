from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import PostViewSet, EditalViewSet, login_view

router = DefaultRouter()
router.register(r'posts', PostViewSet, basename='post')
router.register(r'editals', EditalViewSet, basename='edital')

app_name = 'blog_app'

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', login_view, name='login'),
]
