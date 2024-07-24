def destroyThisGameInformations(playersOnMatchAndItsOppenent, playersOnMatchAndItsRoomId, p1, p2):
    try:
        playersOnMatchAndItsOppenent.pop(p1)
    except:
        pass
    try:
        playersOnMatchAndItsOppenent.pop(p2)
    except:
        pass
    try:
        playersOnMatchAndItsRoomId.pop(p1)
    except:
        pass
    try:
        playersOnMatchAndItsRoomId.pop(p2)
    except:
        pass