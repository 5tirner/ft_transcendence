def destroyThisGameInformations(playersOnMatchAndItsOppenent, playersOnMatchAndItsRoomId, playersOnMatchAndItsRole, p1, p2):
    playersOnMatchAndItsOppenent.pop(p1)
    playersOnMatchAndItsOppenent.pop(p2)
    playersOnMatchAndItsRoomId.pop(p1)
    playersOnMatchAndItsRoomId.pop(p2)
    playersOnMatchAndItsRole.pop(p1)
    playersOnMatchAndItsRole.pop(p2)