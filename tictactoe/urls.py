from django.conf.urls import patterns, include, url

from client.views import home, new_game

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',

    # Home
    url(r'^$', home, name='home'),

    # API
    url(r'^api/new-game/$', new_game, name='new-game'),

    url(r'^admin/', include(admin.site.urls)),
)
