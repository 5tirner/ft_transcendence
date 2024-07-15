from .models import gameInfo
import requests
from rest_framework import response, status
from .roomCodes import roomcode
from .serializer import gameInfoModelSerializer
from rest_framework.decorators import api_view
from django.http import HttpResponse
from django.shortcuts import render


@api_view(['GET', "POST"])
def myProfile(req):
    print("-------------------------USER PROFILE----------------------------------")
    if req.method == "GET":
        try:
            cookies = req.COOKIES.get('jwt_token')
            print(f"Found Cookies: {cookies}")
            cookies = {'jwt_token': cookies}
        except:
            print("No Cookies Found")
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        try:
            authApiResponse = requests.get('http://auth:8000/api/usercheck', cookies=cookies)
            print(authApiResponse.json())
            if authApiResponse.json().get('message') != "User is authenticated":
               print(f"{authApiResponse.json().get('message')}")
               raise Exception("BYE")
            if authApiResponse.json().get('isLoged') == False:
                print("No Login")
                raise Exception("BYE")
        except:
            print("Auth API Failed Succesfully")
            return response.Response(status=status.HTTP_204_NO_CONTENT)
        user_infos  = authApiResponse.json().get('data')
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
    try:
        getUserFromDataBase = gameInfo.objects.get(login=login)
    except:
        return response.Response(status=status.HTTP_404_NOT_FOUND)
    serial = gameInfoModelSerializer(getUserFromDataBase)
    return response.Response(serial.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def TicTacToeLobby(req):
    print("-------------------------USER ON LOBBY----------------------------------")
    try:
        cookies = req.COOKIES.get('jwt_token')
        cookies = {'jwt_token': cookies}
    except:
        print("No Cookies Found")
        return response.Response(status=status.HTTP_204_NO_CONTENT)
    try:
        authApiResponse = requests.get('http://auth:8000/api/usercheck', cookies=cookies)
        if authApiResponse.json().get('message') != "User is authenticated":
           print(f"{authApiResponse.json().get('message')}")
           raise Exception("BYE")
        if authApiResponse.json().get('isLoged') == False:
            print("No Login")
            raise Exception("BYE")
    except:
        print("Auth API Failed Succesfully")
        return response.Response(status=status.HTTP_204_NO_CONTENT)
    user_infos  = authApiResponse.json().get('data')
    print(user_infos)
    return render(req, 'lobby.html')

def game(req):
    print("-------------------------USER ON GAME----------------------------------")
    return HttpResponse("Welcome To The Game")