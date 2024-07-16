from .models import gameInfo, onLobby, history
from rest_framework import response, status
from .roomCodes import roomcode
from .serializer import gameInfoModelSerializer, historyModelSirializer
from rest_framework.decorators import api_view
from django.http import HttpResponse
from django.shortcuts import render
from .isAuthUser import isAuthUser


@api_view(['GET', "POST"])
def myProfile(req):
    print("-------------------------USER PROFILE----------------------------------")
    if req.method == "GET":
        authApiResponse = isAuthUser(req)
        if authApiResponse is None:
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        user_infos  = authApiResponse.json().get('data')
        print(user_infos)
        searchForUserInDataBase = gameInfo.objects.filter(login=user_infos.get('username')).first()
        if searchForUserInDataBase is None:
            print("Glad To See You!")
            user = gameInfo(login=user_infos.get('username'),wins=0,
            loses=0,draws=0,gamesPlayed=0,codeToPlay=roomcode(user_infos.get('username')))
            user.save()
        else:
            print('User Is Already Play Games And Stored In The Database')
            pass
        print("Extract The User From Databases")
        try:
            element = gameInfo.objects.get(login=user_infos.get('username'))
        except:
            print("Failed To GEt Element From DataBase")
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        print(element)
        serial1 = gameInfoModelSerializer(element)
        print("Send Response")
        return response.Response(serial1.data,status=status.HTTP_200_OK)
    elif req.method == "POST":
        dataToPost = req.data
        serial2 = gameInfoModelSerializer(data=dataToPost)
        if serial2.is_valid():
            serial2.save()
            return response.Response(status=status.HTTP_201_CREATED)
        else:
            return response.Response(status=status.HTTP_406_NOT_ACCEPTABLE)

@api_view(["GET"])
def userStatistic(req, login):
    print("-------------------------USER CHECK OTHERS PROFILE----------------------------------")
    print(f"Login={login}")
    authApiResponse = isAuthUser(req)
    if authApiResponse is None:
        return response.Response(status=status.HTTP_204_NO_CONTENT)
    user_infos  = authApiResponse.json().get('data')
    print(user_infos)
    try:
        getUserFromDataBase = gameInfo.objects.get(login=login)
    except:
        return response.Response(status=status.HTTP_404_NOT_FOUND)
    serial = gameInfoModelSerializer(getUserFromDataBase)
    return response.Response(serial.data, status=status.HTTP_200_OK)

@api_view(["GET", "POST"])
def historic(req):
    print("-------------------------USER HESTORY----------------------------------")
    if req.method == "POST":
        serial = historyModelSirializer(data=req.data)
        if serial.is_valid():
            serial.save()
            return response.Response(status=status.HTTP_201_CREATED)
        else:
            return response.Response(status=status.HTTP_204_NO_CONTENT)
    elif req.method == "GET":
        # authApiResponse = isAuthUser(req)
        # if authApiResponse is None:
        #     return response.Response(status=status.HTTP_204_NO_CONTENT)
        # user_infos  = authApiResponse.json().get('data')
        # getUserFromHistoricModel = history.objects.filter(user_infos.get('username'))
        pass

@api_view(["GET"])
def TicTacToeLobby(req):
    print("-------------------------USER ON LOBBY----------------------------------")
    try:
        authApiResponse = isAuthUser(req)
        if authApiResponse is None:
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        user_infos  = authApiResponse.json().get('data')
        print(user_infos)
        searchForUserInDataBase = gameInfo.objects.filter(login=user_infos.get('username')).first()
        if searchForUserInDataBase is None:
            print("Glad To See You!")
            user = gameInfo(login=user_infos.get('username'),wins=0,
            loses=0,draws=0,gamesPlayed=0,codeToPlay=roomcode(user_infos.get('username')))
            user.save()
        else:
            print('User Is Already Play Games And Stored In The Database')
            pass
        print("Extract The User From Databases")
        user = onLobby(login=user_infos.get('username'))
        user.save()
        print("User Added To Lobby")
        return render(req, 'lobby.html')
    except:
        return response.Response(status=status.HTTP_204_NO_CONTENT)


@api_view(["GET"])
def game(req):
    print("-------------------------USER ON GAME----------------------------------")
    try:
        authApiResponse = isAuthUser(req)
        if authApiResponse is None:
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        user_infos  = authApiResponse.json().get('data')
        print(user_infos)
        return render(req, 'game.html')
    except:
        return response.Response(status=status.HTTP_204_NO_CONTENT)