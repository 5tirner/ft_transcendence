from django.shortcuts import render, redirect
from django.http import HttpResponse

def home(req):
    if req.method == "POST":
        return redirect('/pingpong/' + req.POST.get('roomcode') + '?player=' + req.POST.get('alias'))
    return render(req, 'home.html')

def play(req, roomcode):
    return HttpResponse("Welcome To The Game")
