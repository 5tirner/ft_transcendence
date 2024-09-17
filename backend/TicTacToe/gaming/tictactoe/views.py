from .models import gameInfo, history, playerAndHisPic
from rest_framework import response, status
from .roomCodes import roomcode
from .serializer import gameInfoModelSerializer
from rest_framework.decorators import api_view
from django.http import JsonResponse
from .isAuthUser import isAuthUser
import json


@api_view(['POST'])
def updateImageTTT(req):
    print("-------------------------USER PICTURE UPDATE----------------------------------")
    authApiResponse = isAuthUser(req)
    if authApiResponse is None:
        return response.Response(status=status.HTTP_404_NOT_FOUND)
    userInfos = authApiResponse.json().get('data')
    print(f"- IncomingData: {req.data}")
    print(f"- User Infos: {userInfos}")
    userLogin = userInfos.get('username')
    try:
        gameInfo.objects.get(login=userLogin)
        print(f"YOU AGAIN? -> {userLogin}")
    except:
        print(f"HUH FIRSTTIME? -> {userLogin}")
        addUserToDB = gameInfo(login=userLogin, codeToPlay=roomcode(userLogin))
        addUserToDB.save()
        print(f"pongInfo += {gameInfo.objects.get(login=userLogin)}")
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
def updateInfoTTT(req):
    print("-------------------------USER INFOS UPDATE----------------------------------")
    authApiResponse = isAuthUser(req)
    if authApiResponse is None:
        return response.Response(status=status.HTTP_204_NO_CONTENT)
    user_infos = authApiResponse.json().get('data')
    # print(f"- User Infos: {user_infos}")
    # print(f"Data: {req.data}")
    oldLogin = user_infos.get('username')
    newLogin = req.data.get('newLogin')
    try:
        gameInfo.objects.get(login=newLogin)
        print(f"You Can't Update To This Login: {newLogin}, Already Used!")
        return response.Response(status=status.HTTP_403_FORBIDDEN)
    except:
        print(f"You Can Go Forward To Update You Name To {newLogin}")
    try:
        gameInfo.objects.get(login=oldLogin)
        print(f"YOU AGAIN? -> {oldLogin}")
    except:
        print(f"HUH FIRSTTIME? -> {oldLogin}")
        addUserToDB = gameInfo(login=oldLogin, codeToPlay=roomcode(oldLogin))
        addUserToDB.save()
        print(f"pongInfo += {gameInfo.objects.get(login=oldLogin)}")
        addUserPic = playerAndHisPic(login=oldLogin, pic=user_infos.get('avatar'))
        addUserPic.save()
        print(f"playerAndHisPic += {playerAndHisPic.objects.get(login=oldLogin)}")
    toEditGameName = gameInfo.objects.get(login=oldLogin)
    toEditGameName.login = newLogin
    toEditGameName.save()
    toEditPicName = playerAndHisPic.objects.get(login=oldLogin)
    toEditPicName.login = newLogin
    toEditPicName.save()
    for i in history.objects.all():
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
            user = gameInfo(login=user_infos.get('username') ,codeToPlay=roomcode(user_infos.get('username')))
            user.save()
            userPic = playerAndHisPic(login=user_infos.get('username'), pic=user_infos.get('avatar'))
            userPic.save()
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

# @api_view(["GET"])
# def userStatistic(req, login):
#     print("-------------------------USER CHECK OTHERS PROFILE----------------------------------")
#     print(f"Login={login}")
#     authApiResponse = isAuthUser(req)
#     if authApiResponse is None:
#         return response.Response(status=status.HTTP_401_UNAUTHORIZED)
#     user_infos  = authApiResponse.json().get('data')
#     print(user_infos)
#     try:
#         getUserFromDataBase = gameInfo.objects.get(login=login)
#     except:
#         return response.Response(status=status.HTTP_404_NOT_FOUND)
#     serial = gameInfoModelSerializer(getUserFromDataBase)
#     return response.Response(serial.data, status=status.HTTP_200_OK)

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