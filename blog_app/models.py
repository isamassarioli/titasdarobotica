from django.db import models
from django.utils.text import slugify
from django.contrib.auth.models import User


def _unique_slug(model_cls, title, current_pk=None):
    base_slug = slugify(title) or 'item'
    slug = base_slug
    index = 2

    while model_cls.objects.filter(slug=slug).exclude(pk=current_pk).exists():
        slug = f'{base_slug}-{index}'
        index += 1

    return slug

class Post(models.Model):
    """Modelo para Blog Posts"""
    STATUS_CHOICES = [
        ('draft', 'Rascunho'),
        ('published', 'Publicado'),
        ('archived', 'Arquivado'),
    ]
    
    CATEGORY_CHOICES = [
        ('competicoes', 'Competições'),
        ('workshops', 'Workshops'),
        ('projetos', 'Projetos'),
        ('eventos', 'Eventos'),
        ('novidades', 'Novidades'),
    ]

    title = models.CharField(max_length=200, verbose_name='Título')
    slug = models.SlugField(unique=True, blank=True, verbose_name='URL amigável')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, verbose_name='Categoria')
    summary = models.TextField(max_length=500, verbose_name='Resumo')
    body = models.TextField(verbose_name='Conteúdo')
    cover_image = models.ImageField(upload_to='blog/covers/', verbose_name='Imagem de capa')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft', verbose_name='Status')
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='posts')
    published_at = models.DateTimeField(null=True, blank=True, verbose_name='Data de publicação')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')

    class Meta:
        ordering = ['-published_at', '-created_at']
        verbose_name = 'Post'
        verbose_name_plural = 'Posts'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = _unique_slug(Post, self.title, self.pk)
        super().save(*args, **kwargs)


class Edital(models.Model):
    """Modelo para Editais e Regulamentos"""
    STATUS_CHOICES = [
        ('draft', 'Rascunho'),
        ('published', 'Publicado'),
        ('closed', 'Fechado'),
        ('archived', 'Arquivado'),
    ]

    title = models.CharField(max_length=200, verbose_name='Título do Edital')
    slug = models.SlugField(unique=True, blank=True, verbose_name='URL amigável')
    description = models.TextField(verbose_name='Descrição')
    rules = models.TextField(verbose_name='Regulamento/Regras')
    document = models.FileField(upload_to='editais/documents/', verbose_name='Arquivo PDF')
    image = models.ImageField(upload_to='editais/images/', verbose_name='Imagem')
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft', verbose_name='Status')
    start_date = models.DateTimeField(verbose_name='Data de início')
    end_date = models.DateTimeField(verbose_name='Data de término')
    author = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='editals')
    created_at = models.DateTimeField(auto_now_add=True, verbose_name='Criado em')
    updated_at = models.DateTimeField(auto_now=True, verbose_name='Atualizado em')

    class Meta:
        ordering = ['-start_date', '-created_at']
        verbose_name = 'Edital'
        verbose_name_plural = 'Editais'

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = _unique_slug(Edital, self.title, self.pk)
        super().save(*args, **kwargs)

    @property
    def is_open(self):
        from django.utils import timezone
        now = timezone.now()
        return self.start_date <= now <= self.end_date and self.status == 'published'
