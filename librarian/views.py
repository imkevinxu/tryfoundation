from django import forms
from django.contrib import messages
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.core import serializers
from django.core.context_processors import csrf
from django.core.mail import send_mail
from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader, RequestContext
from django.views.decorators.csrf import csrf_exempt
from coffin.shortcuts import render_to_response, render, redirect
from emailusernames.utils import create_user, get_user, user_exists

from librarian.models import *
from librarian.model_forms import *
from librarian.forms import *

#@login_required
def index(request):
    return render(request, "index.html", locals())
