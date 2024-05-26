from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
from .models import tttgame

def welcome(req):
    if req.method == "POST":
        username = req.POST.get('username')
        option = req.POST.get('option')
        room_id = req.POST.get('room_id')
        if option == 1:
            aGame = tttgame.object.filter(room_id=room_id).first()
            if aGame is None:
                error = loader.get_template('404.html')
                return HttpResponse(error.render())
            if aGame.game_over:
                over = loader.get_template('gameOver.html')
                return HttpResponse(loader.render())
            aGame.game_oppenent = username
            aGame.save()
        elif option == 2:
            aGame = Game(game_creator = username, room_id = room_id)
            aGame.save()
            return redirect('tictactoe/' + room_id + '?usernsme='+username)
    tmp = loader.get_template('welcome.html')
    return HttpResponse(tmp.render())

def game(req, room_id):
    username = req.GET.get('username')
    tmp = loader.get_template('game.html')
    context = {
        'room_id': room_id, 'username': username,
    }
    return HttpResponse(tmp.render())
