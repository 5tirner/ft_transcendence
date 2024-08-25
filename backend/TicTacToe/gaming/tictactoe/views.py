from .models import gameInfo, history, playerAndHisPic
from rest_framework import response, status
from .roomCodes import roomcode
from .serializer import gameInfoModelSerializer
from rest_framework.decorators import api_view
from django.http import JsonResponse
from .isAuthUser import isAuthUser
import json


# @api_view(["GET"])
# def home(req):
#     return render(req, 'home.html')

@api_view(["GET"])
def myProfile(req):
    print("-------------------------USER PROFILE----------------------------------")
    if req.method == "GET":
        authApiResponse = isAuthUser(req)
        if authApiResponse is None:
            return response.Response(status=status.HTTP_401_UNAUTHORIZED)
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

@api_view(["GET"])
def userStatistic(req, login):
    print("-------------------------USER CHECK OTHERS PROFILE----------------------------------")
    print(f"Login={login}")
    authApiResponse = isAuthUser(req)
    if authApiResponse is None:
        return response.Response(status=status.HTTP_401_UNAUTHORIZED)
    user_infos  = authApiResponse.json().get('data')
    print(user_infos)
    try:
        getUserFromDataBase = gameInfo.objects.get(login=login)
    except:
        return response.Response(status=status.HTTP_404_NOT_FOUND)
    serial = gameInfoModelSerializer(getUserFromDataBase)
    return response.Response(serial.data, status=status.HTTP_200_OK)

@api_view(["GET"])
def historic(req):
    print("-------------------------USER HESTORY----------------------------------")
    authApiResponse = isAuthUser(req)
    if authApiResponse is None:
        return response.Response(status=status.HTTP_401_UNAUTHORIZED)
    user_infos  = authApiResponse.json().get('data')
    name = user_infos.get('username')
    allMatches = dict(dict())
    matchNumbers = 1
    for i in history.objects.all().values():
        if i.get('you') == name:
            print(f"--------------{i}---------------")
            i['pic'] = playerAndHisPic.objects.get(login=i.get('oppenent')).pic
            allMatches[f"match{matchNumbers}"] = i
            matchNumbers += 1
    return JsonResponse(json.dumps(allMatches), safe=False)

# @api_view(["GET"])
# def TicTacToeLobby(req):
#     print("-------------------------USER ON LOBBY----------------------------------")
#     try:
#         authApiResponse = isAuthUser(req)
#         if authApiResponse is None:
#             return response.Response(status=status.HTTP_204_NO_CONTENT)
#         user_infos  = authApiResponse.json().get('data')
#         print(user_infos)
#         searchForUserInDataBase = gameInfo.objects.filter(login=user_infos.get('username')).first()
#         if searchForUserInDataBase is None:
#             print("Glad To See You!")
#             user = gameInfo(login=user_infos.get('username'),wins=0,
#             loses=0,draws=0,gamesPlayed=0,codeToPlay=roomcode(user_infos.get('username')))
#             user.save()
#         else:
#             print('User Is Already Play Games And Stored In The Database')
#             pass
#         print("Extract The User From Databases")
#         user = onLobby(login=user_infos.get('username'))
#         user.save()
#         print("User Added To Lobby")
#         return render(req, 'lobby.html')
#     except:
#         return response.Response(status=status.HTTP_204_NO_CONTENT)


# @api_view(["GET"])
# def game(req):
#     print("-------------------------USER ON GAME----------------------------------")
#     try:
#         authApiResponse = isAuthUser(req)
#         if authApiResponse is None:
#             return response.Response(status=status.HTTP_204_NO_CONTENT)
#         user_infos  = authApiResponse.json().get('data')
#         print(user_infos)
#         searchForUserInDataBase = gameInfo.objects.filter(login=user_infos.get('username')).first()
#         if searchForUserInDataBase is None:
#             print("Glad To See You!")
#             user = gameInfo(login=user_infos.get('username') ,codeToPlay=roomcode(user_infos.get('username')))
#             user.save()
#         else:
#             print('User Is Already Play Games And Stored In The Database')
#             pass
#         return response.Response(status=status.HTTP_200_OK)
#     except:
#         return response.Response(status=status.HTTP_204_NO_CONTENT)