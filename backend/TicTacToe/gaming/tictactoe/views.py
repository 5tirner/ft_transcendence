from django.http import JsonResponse, HttpResponse
from .models import gameInfo
import requests
from rest_framework import response, status
from .roomCodes import roomcode
from .serializer import gameInfoModelSerializer
from rest_framework.decorators import api_view

@api_view(['GET'])
def home(req):
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
    element = gameInfo.objects.get(login=user_infos.get('username'))
    print(element)
    serial = gameInfoModelSerializer(element)
    print("Send Response")
    return response.Response(serial.data,status=status.HTTP_200_OK)
    # if req.method == "POST":
    #     print("\n\n===============> Start: User Fill His Info:\n")
    #     print("\n**********************************")
    #     print("Method Informations:")
    #     print(f"Method = {req.method}")
    #     print(f"Content = {req.POST}")
    #     print("**********************************\n")
    #     alias, roomcode, role = req.POST.get("alias"), req.POST.get("roomcode"), req.POST.get("gamerole")
    #     if checkInput(alias, roomcode, role) == False:
    #         print("Bad Input")
    #         return render(req, 'badinput.html')
    #     isAlredyUsed = isTheAliasOrTheRoomCodeAlreadyUsed(alias, roomcode)
    #     if isAlredyUsed == -1:
    #         print(f"This Alias {alias} Used Before")
    #         return HttpResponse(f"This Alias `{alias}` Already Used By Other Player.")
    #     if role == "1":
    #         if isAlredyUsed == -2:
    #             print(f"This RoomCode {roomcode} Used Bedore")
    #             return HttpResponse(f"This RoomCode `{roomcode}` Already Used By Other Player.")
    #         print("\n**********************************")
    #         print(f"{alias} Is A Game Creator")
    #         tmp = players(gcreator=alias, roomcode=roomcode)
    #         tmp.save()
    #         print(f"{alias} Craetor Infos-> GC: {tmp.gcreator}, RC: {tmp.roomcode}, GO: {tmp.oppenent}, GS:{tmp.gamestat}")
    #         print("**********************************\n")
    #         return redirect('ttt/' + roomcode + '?player=' + alias)
    #     elif role == "2":
    #         print("\n**********************************")
    #         print(f"{alias} Want To Join Game")
    #         if isAlredyUsed != -2:
    #             print(f"This RoomCode {roomcode} Did Not Match Any Game")
    #             return HttpResponse(f"No Room Matched With This Code`{roomcode}`.")
    #         tmp = players.objects.filter(roomcode=roomcode).first()
    #         if tmp.gamestat == True:
    #             print(f"The Room Of The RoomCode {roomcode} Is Full")
    #             return HttpResponse(f"Room Is Full")
    #         tmp.oppenent = alias
    #         tmp.gamestat = True
    #         tmp.save()
    #         print(f"{alias} Oppenets Infos->  GC: {tmp.gcreator}, RC: {tmp.roomcode}, GO: {tmp.oppenent}, GS:{tmp.gamestat}")
    #         print("\n**********************************\n")
    #         return redirect('ttt/' + roomcode + '?player=' + alias)
    # return render(req, 'home.html')

def game(req, roomcode):
    pass
    # print("\n**********************************\n")
    # print(f'On Game Data ==> {req.GET}')
    # alias = req.GET.get('player')
    # if players.objects.filter(gcreator=alias).first() is None and players.objects.filter(oppenent=alias).first() is None:
    #     return HttpResponse("USER NOT FOUND")
    # player1, player2, role = "", "", 0
    # if players.objects.filter(gcreator=alias).first() is not None:
    #     player1 = players.objects.filter(gcreator=alias).first().gcreator
    #     player2 = players.objects.filter(gcreator=alias).first().oppenent
    #     role = 1
    # else:
    #     player2 = players.objects.filter(oppenent=alias).first().gcreator
    #     player1 = players.objects.filter(oppenent=alias).first().oppenent
    #     role = 2
    # context = {
    #     'roomcode': roomcode,
    #     'alias' : alias,
    #     'p1': player1,
    #     'p2': player2,
    #     'role': role,
    # }
    # print("\n**********************************\n")
    # return render(req, 'play.html', context)