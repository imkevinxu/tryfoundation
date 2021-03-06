from coffin.conf.urls.defaults import *
from coffin.shortcuts import redirect
from django.contrib.auth.views import logout

from config.jinja2 import login

def smartlogin(request, **kwargs):
    if request.user.is_authenticated() and 'next' not in request.GET:
        return redirect('learn')
    return login(request, **kwargs)

urlpatterns = patterns('librarian.views',
    url(r'^$', 'index', name='index'),
    url(r'^learn/$', 'learn', name='learn'),
    url(r'^lesson/(?P<slug>[\w-]+)/$', 'lesson', name='lesson'),
    url(r'^attempt/$', 'attempt', name='attempt'),

    url(r'^signup/$', 'signup', name='signup'),
    url(r'^confirm/$', 'confirm', name='confirm'),
    url(r'^create/$', 'create', name='create'),

    url(r'^login/$', smartlogin, kwargs=dict(template_name='login.html'), name='login'),
    url(r'^logout/$', logout, kwargs=dict(next_page='/'), name='logout'),
)
