from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
from . import models

def welcome(req):
    template = loader.get_template('welcome.html')
    return HttpResponse(template.render())
def start(req):
    data = models.Players.objects.all().values()
    template = loader.get_template('start.html')
    context = {
        'user': data,
    }
    return HttpResponse(template.render(context, req))

def details(req, id):
    user = models.Players.objects.get(id=id)
    template = loader.get_template('show.html')
    context = {
        'user': user,
    }
    return HttpResponse(template.render(context, req))
