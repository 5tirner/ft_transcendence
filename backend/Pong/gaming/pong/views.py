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
        element = pongGameInfo.objects.get(login=userInfo.get('username'))
        serial = pongGameInfoSerializer(element)
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
    pass

@api_view(['GET'])
def PongGame(req):
    AuthApiRes = isAuthUser(req)
    if req is None:
        print("This User Does Not Authenticated")
        return response.Response(status=status.HTTP_203_NON_AUTHORITATIVE_INFORMATION)
    return render(req, 'game.html')