from django.shortcuts import render, redirect
from django.http import JsonResponse, HttpResponse
from .pars import checkInput, isTheAliasOrTheRoomCodeAlreadyUsed
from .models import players

def home(req):
    if req.method == "POST":
        print("\n**********************************")
        print("Method Informations:")
        print(f"Method = {req.method}")
        print(f"Content = {req.POST}")
        print("**********************************\n")
        alias, roomcode, role = req.POST.get("alias"), req.POST.get("roomcode"), req.POST.get("gamerole")
        if checkInput(alias, roomcode, role) == False:
            print("Bad Input")
            return render(req, 'badinput.html')
        isAlredyUsed = isTheAliasOrTheRoomCodeAlreadyUsed(alias, roomcode)
        if isAlredyUsed == -1:
            print(f"This Alias {alias} Used Before")
            return HttpResponse(f"This Alias `{alias}` Already Used By Other Player.")
        if role == "1":
            if isAlredyUsed == -2:
                print(f"This RoomCode {roomcode} Used Bedore")
                return HttpResponse(f"This RoomCode `{roomcode}` Already Used By Other Player.")
            print("\n**********************************")
            print(f"{alias} Is A Game Creator")
            tmp = players(gcreator=alias, roomcode=roomcode)
            tmp.save()
            print(f"{alias} Craetor Infos-> GC: {tmp.gcreator}, RC: {tmp.roomcode}, GO: {tmp.oppenent}, GS:{tmp.gamestat}")
            print("**********************************\n")
        elif role == "2":
            print("\n**********************************")
            print(f"{alias} Want To Join Game")
            if isAlredyUsed != -2:
                print(f"This RoomCode {roomcode} Did Not Match Any Game")
                return HttpResponse(f"No Room Matched With This Code`{roomcode}`.")
            tmp = players.objects.filter(roomcode=roomcode).first()
            tmp.oppenent = alias
            tmp.save()
            print(f"{alias} Oppenets Infos->  GC: {tmp.gcreator}, RC: {tmp.roomcode}, GO: {tmp.oppenent}, GS:{tmp.gamestat}")
    return render(req, 'home.html')

def game(req):
    return JsonResponse({'message': "Hello"})