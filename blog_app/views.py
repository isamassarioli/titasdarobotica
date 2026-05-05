from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from .models import Post, Edital
from .serializers import PostSerializer, EditalSerializer


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
        closed_editals = self.get_queryset().filter(
            status__in=['closed', 'archived']
        )
        serializer = self.get_serializer(closed_editals, many=True)
        return Response(serializer.data)
