import requests

authAPI = "http://127.0.0.1:8000/api/signups/"
loginAPI = "http://127.0.0.1:8000/api/logins/"
creatChatroomAPI = "http://127.0.0.1:8000/api/chat/create/"


def create_users():
    """
    create users in db if they don't exist
    """

    print(2 * "\t", "================= register test users ==================")
    data = {"email": "", "username": "", "password": "1234"}
    # create login user
    data["email"] = f"user@user.com"
    data["username"] = f"user"
    res = requests.post(authAPI, data=data)
    print(f"user respons ==>", res.json(), res.status_code)
    for i in range(5):
        data["email"] = f"user{i}@user.com"
        data["username"] = f"user{i}"
        res = requests.post(authAPI, data=data)
        print(f"user{i} respons ==>", res.json(), res.status_code)
    print(2 * "\t", "=======================================================", 2 * "\n")


def get_auth_cookie(user):
    login_data = {"username": user, "password": "1234"}
    res = requests.post(loginAPI, data=login_data)
    jwt_token = res.cookies["jwt_token"]
    cooki = {"jwt_token": jwt_token}
    return cooki


def create_chatrooms():
    print(2 * "\t", "================= create chatrooms ====================")
    user = {"username": ""}
    cookie = get_auth_cookie("user@user.com")
    for i in range(5):
        user["username"] = f"user{i}"
        res = requests.post(creatChatroomAPI, data=user, cookies=cookie)
        print(f"user{i} respons ==>", res.json(), res.status_code)

    print(2 * "\t", "=======================================================")
    cookie = get_auth_cookie("user0@user.com")
    for i in range(5):
        user["username"] = f"user{i}"
        res = requests.post(creatChatroomAPI, data=user, cookies=cookie)
        print(f"user{i} respons ==>", res.json(), res.status_code)
    print(2 * "\t", "=======================================================")

    cookie = get_auth_cookie("user1@user.com")
    for i in range(5):
        user["username"] = f"user{i}"
        res = requests.post(creatChatroomAPI, data=user, cookies=cookie)
        print(f"user{i} respons ==>", res.json(), res.status_code)
    print(2 * "\t", "=======================================================")


create_users()
create_chatrooms()