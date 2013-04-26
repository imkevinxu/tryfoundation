from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin
from django import forms
from django.db.models.signals import post_save
from django.template.defaultfilters import slugify

import datetime
import os

class Base(models.Model):
    created_at  = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now_add=True, auto_now=True)

    class Meta:
        abstract = True

class UserProfile(models.Model):
    user     = models.OneToOneField(User)
    gravatar = models.URLField(blank=True, null=True)

    # Class Functions
    def __unicode__(self):
        if self.user.get_full_name() != '':
            return self.user.get_full_name()
        return u'%s' % self.user

    def save(self, *args, **kwargs):
        try:
            existing = UserProfile.objects.get(user=self.user)
            self.id = existing.id #force update instead of insert
        except UserProfile.DoesNotExist:
            pass
        models.Model.save(self, *args, **kwargs)

def create_user_profile(sender, instance, created, **kwargs):
    if created:
       profile, created = UserProfile.objects.get_or_create(user=instance)

post_save.connect(create_user_profile, sender=User)

class Lesson(Base):
    title = models.CharField(max_length=255)
    slug  = models.SlugField(max_length=255)

    def _code_partial(self):
        return 'code/%s.html' % self.slug
    def _lesson_partial(self):
        return 'lesson/%s.html' % self.slug
    def _example_partial(self):
        return 'example/%s.html' % self.slug
    def _documentation_partial(self):
        return 'documentation/%s.html' % self.slug
    def _quiz_partial(self):
        return 'quiz/%s.html' % self.slug

    code_partial          = property(_code_partial)
    lesson_partial        = property(_lesson_partial)
    example_partial       = property(_example_partial)
    documentation_partial = property(_documentation_partial)
    quiz_partial          = property(_quiz_partial)

    def save(self, *args, **kwargs):
        if not self.id:
            # Newly created object, so set slug
            self.slug = slugify(self.title)

        super(Lesson, self).save(*args, **kwargs)