from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader

def welcome(req):
    template = loader.get_template('welcome.html')
    return HttpResponse(template.render())
def start(req):
    template = loader.get_template('start.html')
    return HttpResponse(template.render())
