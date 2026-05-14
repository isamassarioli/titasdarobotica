"""
URL configuration for Titãs da Robótica backend.
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView
from blog_app.views import post_detail_view, post_list_view, edital_detail_view, edital_list_view
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('blog_app.urls')),
    path('', TemplateView.as_view(template_name='index.html'), name='home'),
    path('blog/', post_list_view, name='blog_list'),
    path('blog/<slug:slug>/', post_detail_view, name='post_detail'),
    path('editais/', edital_list_view, name='edital_list'),
    path('editais/<slug:slug>/', edital_detail_view, name='edital_detail'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
