from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action, api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.utils import timezone
from .models import Post, Edital
from .serializers import PostSerializer, EditalSerializer
from django.shortcuts import render, get_object_or_404
from django.http import HttpResponse


class IsEditorOrReadOnly(permissions.BasePermission):
    """
    Permissão customizada: qualquer um pode ler,
    mas só admin/editor pode criar/editar/deletar
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated and request.user.is_staff

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and (request.user.is_staff or obj.author == request.user)


class PostViewSet(viewsets.ModelViewSet):
    """API para gerenciar Posts (Blog)"""
    serializer_class = PostSerializer
    permission_classes = [IsEditorOrReadOnly]
    lookup_field = 'slug'
    filterset_fields = ['category', 'status']
    search_fields = ['title', 'summary', 'body']
    ordering_fields = ['published_at', 'created_at']
    ordering = ['-published_at', '-created_at']

    def get_queryset(self):
        """Retorna apenas posts publicados para usuários não-autenticados"""
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Post.objects.all()
        return Post.objects.filter(status='published')

    def perform_create(self, serializer):
        """Atribui o usuário atual como author"""
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        """Atualiza mantendo o author"""
        serializer.save(author=self.request.user)

    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Retorna os 3 últimos posts publicados"""
        latest_posts = self.get_queryset()[:3]
        serializer = self.get_serializer(latest_posts, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_category(self, request):
        """Agrupa posts por categoria"""
        category = request.query_params.get('category')
        if not category:
            return Response({'error': 'category parameter required'}, status=status.HTTP_400_BAD_REQUEST)
        
        posts = self.get_queryset().filter(category=category)
        serializer = self.get_serializer(posts, many=True)
        return Response(serializer.data)


class EditalViewSet(viewsets.ModelViewSet):
    """API para gerenciar Editais"""
    serializer_class = EditalSerializer
    permission_classes = [IsEditorOrReadOnly]
    lookup_field = 'slug'
    filterset_fields = ['status']
    search_fields = ['title', 'description', 'rules']
    ordering_fields = ['start_date', 'created_at']
    ordering = ['-start_date', '-created_at']

    def get_queryset(self):
        """Retorna apenas editais publicados para usuários não-autenticados"""
        if self.request.user.is_authenticated and self.request.user.is_staff:
            return Edital.objects.all()
        return Edital.objects.filter(status='published')

    def perform_create(self, serializer):
        """Atribui o usuário atual como author"""
        serializer.save(author=self.request.user)

    def perform_update(self, serializer):
        """Atualiza mantendo o author"""
        serializer.save(author=self.request.user)

    @action(detail=False, methods=['get'])
    def open(self, request):
        """Retorna apenas editais abertos para inscrições"""
        open_editals = self.get_queryset().filter(
            status='published',
            start_date__lte=timezone.now(),
            end_date__gte=timezone.now()
        )
        serializer = self.get_serializer(open_editals, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def closed(self, request):
        """Retorna editais fechados"""
        if request.user.is_authenticated and request.user.is_staff:
            closed_editals = self.get_queryset().filter(status__in=['closed', 'archived'])
        else:
            closed_editals = Edital.objects.filter(status__in=['closed', 'archived'])
        serializer = self.get_serializer(closed_editals, many=True)
        return Response(serializer.data)


# ========== AUTENTICAÇÃO ==========

@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    """Endpoint de login - retorna token de autenticação"""
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response(
            {'error': 'Username e password são obrigatórios'},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = authenticate(username=username, password=password)
    
    if not user:
        return Response(
            {'error': 'Credenciais inválidas'},
            status=status.HTTP_401_UNAUTHORIZED
        )

    # Verificar se o usuário é staff (admin)
    if not user.is_staff:
        return Response(
            {'error': 'Usuário não tem permissão de administrador'},
            status=status.HTTP_403_FORBIDDEN
        )

    # Gerar ou obter token
    token, created = Token.objects.get_or_create(user=user)
    
    return Response({
        'token': token.key,
        'user': {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'is_staff': user.is_staff
        }
    })


# ========== VIEWS TEMPLATES (FRONTEND) ==========
def post_list_view(request):
    posts = Post.objects.filter(status='published').order_by('-published_at')
    return render(request, 'blog_list.html', {'posts': posts})


def post_detail_view(request, slug):
    if request.user.is_authenticated and request.user.is_staff:
        post = get_object_or_404(Post, slug=slug)
    else:
        post = get_object_or_404(Post, slug=slug, status='published')
    return render(request, 'blog_detail.html', {'post': post})


def edital_list_view(request):
    editais = Edital.objects.filter(status='published').order_by('-start_date')
    return render(request, 'edital_list.html', {'editais': editais})


def edital_detail_view(request, slug):
    if request.user.is_authenticated and request.user.is_staff:
        edital = get_object_or_404(Edital, slug=slug)
    else:
        edital = get_object_or_404(Edital, slug=slug, status='published')
    return render(request, 'edital_detail.html', {'edital': edital})
