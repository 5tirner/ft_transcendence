from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.template import loader
from .models import tttgame
from django.http import JsonResponse
import json

def welcome(req):
    if req.method == "POST":
        # print('form has been posted')
        # json_data = json.loads(req.body)
        # print(json_data.get("password"))
        # return JsonResponse({'password': json_data.get('password', 'hello')})
        print("-----------------------------------")
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
        print("-----------------------------------")

        if option == "1":
            if tttgame.objects.filter(game_oppenent=username).first() is not None or tttgame.objects.filter(game_creator=username).first() is not None:
                print("----------------------------")
                print(f"{username} Alraedy Here")
                print("----------------------------")
                return HttpResponse(f"{username}: Already Used By Someone Else, Try Other UserName")
            print("-----------------------------------")
            print(f"{username} wants to join to a room")
            print("-----------------------------------")
            aGame = tttgame.objects.filter(room_id=room_id).first()

            if aGame is None:
                print("----------------------------")
                print(f"There Is No Room By This Id {room_id}")
                print("----------------------------")
                return HttpResponse(f"This Id {room_id} Matching No Game")

            print("-----------------------------------")
            print(f"Room Id Matched With: {aGame.room_id}")
            print("-----------------------------------")
            aGame.game_oppenent = username
            aGame.save()
            return redirect('tictactoe/' + room_id + '?username='+username)

        elif option == "2":
            print("-----------------------------------")
            print(f"{username} wants to create a room")
            print("-----------------------------------")
            if tttgame.objects.filter(game_creator=username).first() is not None or tttgame.objects.filter(game_oppenent=username).first() is not None:
                return HttpResponse("The Name That You Use Already Used By Someone Else, Try Other UserName")

            if tttgame.objects.filter(room_id=room_id).first() is not None:
                return HttpResponse("The RoomID That You Use Already Used By Someone Else, Try Other ID")

            aGame = tttgame(game_creator = username, room_id = room_id)
            aGame.save()
            return redirect('tictactoe/' + room_id + '?username='+username)

        else :
            return HttpResponse("You Didn't Create Room Nor Try To Join A One!")

    tmp = loader.get_template('welcome.html')
    return HttpResponse(tmp.render())

def game(req, room_id):

    username = req.GET.get('username')

    if tttgame.objects.filter(game_creator=username).first() is not None:
        print("-----------------------------------")
        print(f"{username}: The Game Creator")
        print("-----------------------------------")

    elif tttgame.objects.filter(game_oppenent=username).first() is not None:
        print("-----------------------------------")
        print(f"{username}: The Oppenet")
        print("-----------------------------------")

    if tttgame.objects.filter(game_creator=username).first() is None and tttgame.objects.filter(game_oppenent=username).first() is None:
        print("----------------------------")
        print(f"{username}: Can't Find This User In DB")
        print("----------------------------")
        return HttpResponse(f"{username}: User Not Found")

    if tttgame.objects.filter(game_creator=username).first() is not None and tttgame.objects.filter(game_creator=username).first().game_oppenent is None:
        player1 = tttgame.objects.filter(game_creator=username).first().game_creator
        tmp = loader.get_template('game.html')
        context = {
            'status': "Wait",
            'room_id': room_id,
            'player1': player1,
        }
        creator = username
        print("----------------------------")
        print(f"{creator} Waiting...")
        print("----------------------------")
        return HttpResponse(tmp.render(context, req))

    player1 = str("")
    player2 = str("...")
    if tttgame.objects.filter(game_creator=username).first() is not None:
        player1 = tttgame.objects.filter(game_creator=username).first().game_creator
        player2 = tttgame.objects.filter(game_creator=username).first().game_oppenent
    elif tttgame.objects.filter(game_oppenent=username).first() is not None:
        player1 = tttgame.objects.filter(game_oppenent=username).first().game_oppenent
        player2 = tttgame.objects.filter(game_oppenent=username).first().game_creator
    tmp = loader.get_template('game.html')
    context = {
        'status': "Ready",
        'room_id': room_id,
        'player1': player1,
        'player2': player2,
    }
    return HttpResponse(tmp.render(context, req))