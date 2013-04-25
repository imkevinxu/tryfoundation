from librarian.models import *
from django.contrib import admin

class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    ordering = ['-created_at']
    search_fields = ['title']
    prepopulated_fields = {'slug': ('title',),}

admin.site.register(Lesson, LessonAdmin)