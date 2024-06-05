import requests

authAPI = "http://127.0.0.1:8000/api/signups/"


data = {"email": "", "username": "", "password": "1234"}

for i in range(5):
    data["email"] = f"user{i}@user.com"
    data["username"] = f"user{i}"

    requests.post(authAPI, data=data)
