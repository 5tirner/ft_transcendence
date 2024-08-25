from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import response, status
from .serializer import pongGameInfoSerializer
from .models import pongGameInfo, pongHistory, playerAndHisPic
from .isAuthUser import isAuthUser
from .generateCode import roomcode
from django.http import JsonResponse
import json

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

@api_view(['GET'])
def userInfos(req, login):
    print("-------------------------USER CHECK----------------------------------")
    AuthResponse = isAuthUser(req)
    if AuthResponse is None:
        print("This User Does Not Authenticated")
        return response.Response(status=status.HTTP_204_NO_CONTENT)
    try:
        element = pongGameInfo.objects.get(login=login)
        serial = pongGameInfoSerializer(element)
        return response.Response(serial.data, status=status.HTTP_200_OK)
    except:
        print(f"can't Find {login} In DataBase")
        return response.Response(status=status.HTTP_204_NO_CONTENT)
    

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

@api_view(['PUT'])
def updateInfo(req, login):
    authApiResponse = isAuthUser(req)
    if authApiResponse is None:
        return response.Response(status=status.HTTP_204_NO_CONTENT)
    theRightUser = pongGameInfo.objects.get(login=login)
    
    print(req.data)
    return response.Response(status=status.HTTP_100_CONTINUE)

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

@api_view(['GET'])
def PongTournement(req):
    AuthApiRes = isAuthUser(req)
    if AuthApiRes is None:
        print("This User Does Not Authenticated")
        return response.Response(status=status.HTTP_401_UNAUTHORIZED)
    userInfo = AuthApiRes.json().get('data')
    try:
        pongGameInfo.objects.get(login=userInfo.get('username'))
        print(f"Welcome Back {userInfo.get('username')}")
    except:
        print(f"First Game For {userInfo.get('username')}")
        userAdd = pongGameInfo(login=userInfo.get('username'), codeToPlay=roomcode(userInfo.get('username')))
        userAdd.save()
    return render(req, 'gameTournement.html')

def FinalRound(req):
    AuthApiRes = isAuthUser(req)
    if AuthApiRes is None:
        print("This User Does Not Authenticated")
        return response.Response(status=status.HTTP_401_UNAUTHORIZED)
    userInfo = AuthApiRes.json().get('data')
    try:
        pongGameInfo.objects.get(login=userInfo.get('username'))
        print(f"Welcome Back {userInfo.get('username')}")
    except:
        print(f"First Game For {userInfo.get('username')}")
        userAdd = pongGameInfo(login=userInfo.get('username'), codeToPlay=roomcode(userInfo.get('username')))
        userAdd.save()
    return render(req, 'final.html')