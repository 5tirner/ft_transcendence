from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
from .models import tttgame

def welcome(req):
    if req.method == "POST":
        print("Information Posted:")
        username = req.POST.get('username')
        if len(username) == 0:
            return HttpResponse("Invalid UserName")
        print(f"username: {username}")
        option = req.POST.get('option')
        print(f"choose: {option}")
        room_id = req.POST.get('room_id')
        if len(room_id) == 0:
            return HttpResponse("Invalid Room Id")
        print(f"room id: {room_id}")
        if option == "1":
            if tttgame.objects.filter(game_oppenent=username).first() is not None:
                return HttpResponse("The Name That You Use Already Used By Someone Else, Try Other UserName")
            print(f"{username} wants to join to a room")
            aGame = tttgame.objects.filter(room_id=room_id).first()
            print(f"Room Id Matched With: {aGame}")
            if aGame is None:
                return HttpResponse("No Game Matching...")
            aGame.game_oppenent = username
            aGame.save()
            return redirect('tictactoe/' + room_id + '?username='+username)
        elif option == "2":
            print(f"{username} wants to create a room")
            if tttgame.objects.filter(game_creator=username).first() is not None:
                return HttpResponse("The Name That You Use Already Used By Someone Else, Try Other UserName")
            if tttgame.objects.filter(room_id=room_id).first() is not None:
                return HttpResponse("The RoomID That You Use Already Used By Someone Else, Try Other ID")
            aGame = tttgame(game_creator = username, room_id = room_id)
            aGame.save()
            return redirect('tictactoe/' + room_id + '?username='+username)
        else :
            return HttpResponse("You Didn't Create Room Nor Try To Join A One!")
    print("Welcome There")
    tmp = loader.get_template('welcome.html')
    return HttpResponse(tmp.render())

def game(req, room_id):
    username = req.GET.get('username')
    if tttgame.objects.filter(game_creator=username).first() is None and tttgame.objects.filter(game_oppenent=username).first() is None:
        return HttpResponse("User Not Found")
    print(f"username: {username}")
    tmp = loader.get_template('game.html')
    context = {
        'room_id': room_id, 'username': username,
    }
    return HttpResponse(tmp.render(context, req))
