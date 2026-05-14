from django.contrib import admin
from django.utils.html import format_html
from .models import Post, Edital

@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'category', 'status_badge', 'supabase_synced_badge', 'author', 'published_at', 'created_at')
    list_filter = ('status', 'category', 'created_at', 'published_at')
    search_fields = ('title', 'summary', 'body')
    readonly_fields = ('slug', 'created_at', 'updated_at', 'supabase_id')
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('title', 'category', 'status')
        }),
        ('Conteúdo', {
            'fields': ('summary', 'body', 'cover_image')
        }),
        ('Publicação', {
            'fields': ('author', 'published_at')
        }),
        ('Sincronização Supabase', {
            'fields': ('supabase_id',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def status_badge(self, obj):
        colors = {
            'draft': 'orange',
            'published': 'green',
            'archived': 'gray',
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="color: white; background-color: {}; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def supabase_synced_badge(self, obj):
        if obj.supabase_id:
            return format_html(
                '<span style="color: white; background-color: green; padding: 3px 10px; border-radius: 3px;">✓ Sincronizado</span>'
            )
        else:
            return format_html(
                '<span style="color: white; background-color: orange; padding: 3px 10px; border-radius: 3px;">⏳ Aguardando</span>'
            )
    supabase_synced_badge.short_description = 'Supabase'

    def save_model(self, request, obj, form, change):
        if not obj.author:
            obj.author = request.user
        super().save_model(request, obj, form, change)


@admin.register(Edital)
class EditalAdmin(admin.ModelAdmin):
    list_display = ('title', 'status_badge', 'supabase_synced_badge', 'start_date', 'end_date', 'is_open_badge', 'author', 'created_at')
    list_filter = ('status', 'created_at', 'start_date', 'end_date')
    search_fields = ('title', 'description', 'rules')
    readonly_fields = ('slug', 'created_at', 'updated_at', 'supabase_id', 'is_open_badge')
    fieldsets = (
        ('Informações Básicas', {
            'fields': ('title', 'status', 'image')
        }),
        ('Conteúdo', {
            'fields': ('description', 'rules', 'document')
        }),
        ('Datas', {
            'fields': ('start_date', 'end_date')
        }),
        ('Publicação', {
            'fields': ('author',)
        }),
        ('Sincronização Supabase', {
            'fields': ('supabase_id',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
    )

    def status_badge(self, obj):
        colors = {
            'draft': 'orange',
            'published': 'green',
            'closed': 'red',
            'archived': 'gray',
        }
        color = colors.get(obj.status, 'gray')
        return format_html(
            '<span style="color: white; background-color: {}; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color,
            obj.get_status_display()
        )
    status_badge.short_description = 'Status'

    def supabase_synced_badge(self, obj):
        if obj.supabase_id:
            return format_html(
                '<span style="color: white; background-color: green; padding: 3px 10px; border-radius: 3px;">✓ Sincronizado</span>'
            )
        else:
            return format_html(
                '<span style="color: white; background-color: orange; padding: 3px 10px; border-radius: 3px;">⏳ Aguardando</span>'
            )
    supabase_synced_badge.short_description = 'Supabase'

    def is_open_badge(self, obj):
        color = 'green' if obj.is_open else 'red'
        text = 'Aberto' if obj.is_open else 'Fechado'
        return format_html(
            '<span style="color: white; background-color: {}; padding: 3px 10px; border-radius: 3px;">{}</span>',
            color,
            text
        )
    is_open_badge.short_description = 'Aberto para inscrições'

    def save_model(self, request, obj, form, change):
        if not obj.author:
            obj.author = request.user
        super().save_model(request, obj, form, change)
