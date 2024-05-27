from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
from .models import tttgame

def welcome(req):
    if req.method == "POST":
        print("Information Posted:")
        username = req.POST.get('username')
        print(f"username: {username}")
        option = req.POST.get('option')
        print(f"choose: {option}")
        print(type(option))
        room_id = req.POST.get('room_id')
        print(f"room id: {room_id}")
        if option == "1":
            print(f"{username} wants to join to a room")
            aGame = tttgame.objects.filter(room_id=room_id).first()
            if aGame is None:
                print("!!Game Is None!!")
                error = loader.get_template('404.html')
                return HttpResponse(error.render())
            elif aGame.game_over:
                print("!!Game Is Over!!")
                over = loader.get_template('gameOver.html')
                return HttpResponse(over.render())
            aGame.game_oppenent = username
            aGame.save()
            return redirect('tictactoe/' + room_id + '?username='+username)
        elif option == "2":
            print(f"{username} wants to create a room")
            aGame = tttgame(game_creator = username, room_id = room_id)
            aGame.save()
            return redirect('tictactoe/' + room_id + '?username='+username)
        else :
            return render(req, "404.html")
    print("Welcome There")
    tmp = loader.get_template('welcome.html')
    return HttpResponse(tmp.render())

def game(req, room_id):
    username = req.GET.get('username')
    print(f"username: {username}")
    tmp = loader.get_template('game.html')
    context = {
        'room_id': room_id, 'username': username,
    }
    return HttpResponse(tmp.render(context, req))
