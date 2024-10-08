from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import response, status
from .serializer import pongGameInfoSerializer
from .models import pongGameInfo, pongHistory, playerAndHisPic
from .isAuthUser import isAuthUser
from .generateCode import roomcode
from django.http import JsonResponse
import json
import requests


# @api_view(['POST'])
# def addPlayer(req):
#     print(f"----------------------------------USER ADD--------------------------")
#     authRes = isAuthUser(req)
#     if authRes is None:
#         return response.Response(status=status.HTTP_406_NOT_ACCEPTABLE)
#     # serial = pongGameInfoSerializer(data=req.data)
#     # if serial.is_valid():
#     #     serial.save()
#     #     return response.Response(status=status.HTTP_201_CREATED)
#     userInfos = authRes.json().get('data')
#     print(f"DATA INCOMING = {userInfos}")
#     return response.Response(status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
@api_view(['GET'])
def myProfile(req):
    print("-------------------------USER PROFILE----------------------------------")
    if req.method == "GET":
        AuthApiRes = isAuthUser(req)
        if AuthApiRes is None:
            print("This User Does Not Authenticated")
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        userInfo = AuthApiRes.json().get('data')
        print(f"Data: {userInfo}")
        try:
            pongGameInfo.objects.get(login=userInfo.get('username'))
            print(f"{userInfo.get('username')} Already Appear Here")
        except:
            print("Glad To See You Here")
            addUser = pongGameInfo(login=userInfo.get('username'), codeToPlay=roomcode(userInfo.get('username')))
            addUser.save()
            addUserPic = playerAndHisPic(login=userInfo.get('username'), pic=userInfo.get('avatar'))
            addUserPic.save()
        print(f"Extract The User {userInfo.get('username')} From DataBase")
        element = pongGameInfo.objects.get(login=userInfo.get('username'))
        print(f"User On DataBase: {element}")
        serial = pongGameInfoSerializer(element)
        print(f"Send Response As: {serial.data}")
        return response.Response(serial.data, status=status.HTTP_200_OK)
    # elif req.method == "POST":
    #     dataToPost = req.data
    #     serial = pongGameInfoSerializer(data=dataToPost)
    #     if serial.is_valid():
    #         serial.save()
    #         return response.Response(status=status.HTTP_201_CREATED)
    #     return response.Response(status=status.HTTP_204_NO_CONTENT)

# @api_view(['GET'])
# def userInfos(req, login):
#     print("-------------------------USER CHECK----------------------------------")
#     AuthResponse = isAuthUser(req)
#     if AuthResponse is None:
#         print("This User Does Not Authenticated")
#         return response.Response(status=status.HTTP_204_NO_CONTENT)
#     try:
#         element = pongGameInfo.objects.get(login=login)
#         serial = pongGameInfoSerializer(element)
#         return response.Response(serial.data, status=status.HTTP_200_OK)
#     except:
#         print(f"can't Find {login} In DataBase")
#         return response.Response(status=status.HTTP_204_NO_CONTENT)
    

# @api_view(['GET'])
# def PongGame(req):
#     AuthApiRes = isAuthUser(req)
#     if AuthApiRes is None:
#         print("This User Does Not Authenticated")
#         return response.Response(status=status.HTTP_204_NO_CONTENT)
#     userInfo = AuthApiRes.json().get('data')
#     try:
#         pongGameInfo.objects.get(login=userInfo.get('username'))
#         print(f"Welcome Back {userInfo.get('username')}")
#     except:
#         print(f"First Game For {userInfo.get('username')}")
#         userAdd = pongGameInfo(login=userInfo.get('username'), codeToPlay=roomcode(userInfo.get('username')))
#         userAdd.save()
#     return render(req, 'game.html')

# @api_view(['GET'])
# def PongLocalGame(req):
#     AuthApiRes = isAuthUser(req)
#     if AuthApiRes is None:
#         print("This User Does Not Authenticated")
#         return response.Response(status=status.HTTP_204_NO_CONTENT)
#     return render(req, 'local.html')


@api_view(['POST'])
def updateImage(req):
    print("-------------------------USER PICTURE UPDATE----------------------------------")
    authApiResponse = isAuthUser(req)
    if authApiResponse is None:
        return response.Response(status=status.HTTP_404_NOT_FOUND)
    userInfos = authApiResponse.json().get('data')
    print(f"- IncomingData: {req.data}")
    print(f"- User Infos: {userInfos}")
    userLogin = userInfos.get('username')
    try:
        pongGameInfo.objects.get(login=userLogin)
        print(f"YOU AGAIN? -> {userLogin}")
    except:
        print(f"HUH FIRSTTIME? -> {userLogin}")
        addUserToDB = pongGameInfo(login=userLogin, codeToPlay=roomcode(userLogin))
        addUserToDB.save()
        print(f"pongInfo += {pongGameInfo.objects.get(login=userLogin)}")
        addUserPic = playerAndHisPic(login=userLogin, pic=userInfos.get('avatar'))
        addUserPic.save()
        print(f"playerAndHisPic += {playerAndHisPic.objects.get(login=userLogin)}")
    newPic = req.data.get('newPic')
    if newPic is None:
        return response.Response(status=status.HTTP_406_NOT_ACCEPTABLE)
    toEditPic  = playerAndHisPic.objects.get(login=userLogin)
    toEditPic.pic = newPic
    toEditPic.save()
    return response.Response(status=status.HTTP_200_OK)

@api_view(['POST'])
def updateInfo(req):
    print("-------------------------USER INFOS UPDATE----------------------------------")
    authApiResponse = isAuthUser(req)
    if authApiResponse is None:
        return response.Response(status=status.HTTP_204_NO_CONTENT)
    user_infos = authApiResponse.json().get('data')
    # print(f"- User Infos: {user_infos}")
    # print(f"Data: {req.data}")
    oldLogin = user_infos.get('username')
    newLogin = req.data.get('newLogin')
    if newLogin is None:
        return response.Response(status=status.HTTP_406_NOT_ACCEPTABLE)
    print(f"NEW LOGIN IS -> {newLogin}")
    try:
        pongGameInfo.objects.get(login=newLogin)
        print(f"You Can't Update To This Login: {newLogin}, Already Used!")
        return response.Response(status=status.HTTP_403_FORBIDDEN)
    except:
        print(f"You Can Go Forward To Update You Name To {newLogin}")
    try:
        pongGameInfo.objects.get(login=oldLogin)
        print(f"YOU AGAIN? -> {oldLogin}")
    except:
        print(f"HUH FIRSTTIME? -> {oldLogin}")
        addUserToDB = pongGameInfo(login=oldLogin, codeToPlay=roomcode(oldLogin))
        addUserToDB.save()
        print(f"pongInfo += {pongGameInfo.objects.get(login=oldLogin)}")
        addUserPic = playerAndHisPic(login=oldLogin, pic=user_infos.get('avatar'))
        addUserPic.save()
        print(f"playerAndHisPic += {playerAndHisPic.objects.get(login=oldLogin)}")
    try:
        toEditGameName = pongGameInfo.objects.get(login=oldLogin)
        toEditGameName.login = newLogin
        toEditGameName.save()
        toEditPicName = playerAndHisPic.objects.get(login=oldLogin)
        toEditPicName.login = newLogin
        toEditPicName.save()
        for i in pongHistory.objects.all():
            if i.you == oldLogin:
                if i.you == i.winner:
                    i.winner = newLogin
                i.you = newLogin
                i.save()
            elif i.oppenent == oldLogin:
                if i.oppenent == i.winner:
                    i.winner = newLogin
                i.oppenent = newLogin
                i.save()
        return response.Response(status=status.HTTP_200_OK)
    except Exception as E:
        print(f"The Upadte Failed Cause Of: {E.__cause__}")

@api_view(['GET'])
def historic(req):
    print("-------------------------USER HESTORY----------------------------------")
    authApiResponse = isAuthUser(req)
    if authApiResponse is None:
        return response.Response(status=status.HTTP_401_UNAUTHORIZED)
    user_infos  = authApiResponse.json().get('data')
    name = user_infos.get('username')
    allMatches = dict(dict())
    matchNumbers = 1
    for i in pongHistory.objects.all().values():
        if i.get('you') == name:
            print(f"-----------{i}--------")
            avatar = playerAndHisPic.objects.get(login=i.get('oppenent')).pic
            i['pic'] = avatar
            allMatches[f"match{matchNumbers}"] = i
            matchNumbers += 1
    return JsonResponse(json.dumps(allMatches), safe=False)

# @api_view(['GET'])
# def TournamentHistory(req):
#     print("-------------------------USER Tournament----------------------------------")
#     authApiResponse = isAuthUser(req)
#     if authApiResponse is None:
#         return response.Response(status=status.HTTP_204_NO_CONTENT)
#     user_infos  = authApiResponse.json().get('data')
#     name = user_infos.get('username')
#     allMatches = dict(dict())
#     matchNumbers = 1
#     for i in TournamentInfo.objects.all().values():
#         if i.get('you') == name:
#             allMatches[f"Tournament{matchNumbers}"] = i
#             matchNumbers += 1
#     return JsonResponse(json.dumps(allMatches), safe=False)

# @api_view(['GET'])
# def PongTournement(req):
#     AuthApiRes = isAuthUser(req)
#     if AuthApiRes is None:
#         print("This User Does Not Authenticated")
#         return response.Response(status=status.HTTP_401_UNAUTHORIZED)
#     userInfo = AuthApiRes.json().get('data')
#     try:
#         pongGameInfo.objects.get(login=userInfo.get('username'))
#         print(f"Welcome Back {userInfo.get('username')}")
#     except:
#         print(f"First Game For {userInfo.get('username')}")
#         userAdd = pongGameInfo(login=userInfo.get('username'), codeToPlay=roomcode(userInfo.get('username')))
#         userAdd.save()
#     return render(req, 'gameTournement.html')

# def FinalRound(req):
#     AuthApiRes = isAuthUser(req)
#     if AuthApiRes is None:
#         print("This User Does Not Authenticated")
#         return response.Response(status=status.HTTP_401_UNAUTHORIZED)
#     userInfo = AuthApiRes.json().get('data')
#     try:
#         pongGameInfo.objects.get(login=userInfo.get('username'))
#         print(f"Welcome Back {userInfo.get('username')}")
#     except:
#         print(f"First Game For {userInfo.get('username')}")
#         userAdd = pongGameInfo(login=userInfo.get('username'), codeToPlay=roomcode(userInfo.get('username')))
#         userAdd.save()
#     return render(req, 'final.html')
# 
#


# MotherHugger ostora

from .models import Tournament

def create_tournament(request):
    if request.method == 'POST':
        players = json.loads(request.body).get('players')
        if len(players) != 4:
            return JsonResponse({'error': 'You must submit exactly 4 players.'}, status=400)
        
        tournament = Tournament.objects.create(players=json.dumps(players))
        return JsonResponse({'tournament_id': tournament.id})
    
    return render(request, 'game/tournament.html')
