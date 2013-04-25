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

    def save(self, *args, **kwargs):
        if not self.id:
            # Newly created object, so set slug
            self.slug = slugify(self.title)

        super(Lesson, self).save(*args, **kwargs)