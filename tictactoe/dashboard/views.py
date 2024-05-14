from django.shortcuts import render
from django.http import HttpResponse
from django.template import loader
def dashboard(req):
    template = loader.get_template('dash.html')
    return (HttpResponse(template.render()))
def welcome(req):
    template = loader.get_template('welcome.html')
    return (HttpResponse(template.render()))