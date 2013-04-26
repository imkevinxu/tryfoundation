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

import md5

try:
    import json
except ImportError:
    import simplejson as json

def index(request):
    return render(request, "index.html", locals())

def learn(request):
    confirm = False
    email = request.GET.get('email', None)
    ref = request.GET.get('ref', None)

    if email:
        try:
            user = get_user(email)
            if not user.has_usable_password():
                confirm = True
                logout(request)
            else:
                return redirect('learn')
        except User.DoesNotExist:
            return redirect('learn')

    lessons = Lesson.objects.all()
    return render(request, "learn.html", locals())

def lesson(request, slug):
    try:
        lesson = Lesson.objects.get(slug=slug)

    except Lesson.DoesNotExist:
        return redirect('index')

    return render(request, "lesson.html", locals())

# -----------------------------------------
#   ACCOUNT CREATION FUNCTIONS
# -----------------------------------------

def signup(request):
    if request.method == "POST":
        email = request.POST['email'].strip()
        try:
            user = get_user(email)
            if user == request.user and request.user.is_authenticated() and request.user.has_usable_password():
                return redirect('learn')

            logout(request)
            if not user.has_usable_password():
                return redirect('/learn/?email=%s' % email.replace('+', '%2B'))
            else:
                msg = "You already have an account :)"
                return redirect('/login/?email=%s&msg=%s' % (email.replace('+', '%2B'), msg))

        except User.DoesNotExist:
            logout(request)
            user = create_user(email)
            profile = UserProfile(user=user)
            profile.gravatar = "http://www.gravatar.com/avatar/%s.jpg" % md5.new(email.strip().lower()).hexdigest()
            profile.save()
            return redirect('/learn/?email=%s' % email.replace('+', '%2B'))

    return redirect('index')

def confirm(request):
    status = 'failure'
    if request.method == "POST":
        try:
            user = get_user(request.POST['email'])
            user.set_password(request.POST['password'])
            user.save()
            user = authenticate(email=user.email, password=request.POST['password'])
            if user:
                login(request, user)
                status = 'success'
        except User.DoesNotExist:
            return redirect('index')

    return HttpResponse(json.dumps({
        'status' : status
        }, ensure_ascii=False), mimetype='application/json')

def create(request):
    status = 'failure'
    if request.method == "POST":
        logout(request)
        email = request.POST['email'].strip()
        try:
            user = get_user(email)
            if not user.has_usable_password():
                user.set_password(request.POST['password'])
                user.save()
            user = authenticate(email=user.email, password=request.POST['password'])
            if user:
                login(request, user)
                status = 'success'

        except User.DoesNotExist:
            user = create_user(email, request.POST['password'])
            profile = UserProfile(user=user)
            profile.gravatar = "http://www.gravatar.com/avatar/%s.jpg" % md5.new(email.strip().lower()).hexdigest()
            profile.save()
            user = authenticate(email=user.email, password=request.POST['password'])
            if user:
                login(request, user)
                status = 'success'

    return HttpResponse(json.dumps({
        'status' : status
        }, ensure_ascii=False), mimetype='application/json')