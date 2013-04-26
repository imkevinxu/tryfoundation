from librarian.models import *
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.auth.models import User

# Define an inline admin descriptor for UserProfile model
class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name = 'user'

# Define a new User admin
class UserAdmin(UserAdmin):
    inlines = (UserProfileInline, )
    list_display = ('email', 'first_name', 'last_name', 'date_joined')
    ordering = ['-date_joined']
    search_fields = ['email', 'first_name', 'last_name']

# Re-register UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)

class LessonAdmin(admin.ModelAdmin):
    list_display = ('title', 'created_at')
    ordering = ['-created_at']
    search_fields = ['title']
    prepopulated_fields = {'slug': ('title',),}

admin.site.register(Lesson, LessonAdmin)