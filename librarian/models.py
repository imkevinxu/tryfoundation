from django.db import models
from django.contrib.auth.models import User
from django.contrib import admin
from django import forms
from django.template.defaultfilters import slugify

import datetime
import os

class Base(models.Model):
    created_at  = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now_add=True, auto_now=True)

    class Meta:
        abstract = True

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