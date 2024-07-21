from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework import response, status
from .serializer import pongGameInfoSerializer
from .models import pongGameInfo
from .isAuthUser import isAuthUser
from .generateCode import roomcode


@api_view(['GET', 'POST'])
def myProfile(req):
    print("-------------------------USER PROFILE----------------------------------")
    if req.method == "GET":
        AuthApiRes = isAuthUser(req)
        if req is None:
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
    elif req.method == "POST":
        dataToPost = req.data
        serial = pongGameInfoSerializer(data=dataToPost)
        if serial.is_valid():
            serial.save()
            return response.Response(status=status.HTTP_201_CREATED)
        return response.Response(status=status.HTTP_204_NO_CONTENT)

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
    

@api_view(['GET'])
def PongGame(req):
    AuthApiRes = isAuthUser(req)
    if req is None:
        print("This User Does Not Authenticated")
        return response.Response(status=status.HTTP_204_NO_CONTENT)
    return render(req, 'game.html')