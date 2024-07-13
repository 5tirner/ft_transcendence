import requests

result = requests.get('http://127.0.0.1:8000/api/usercheck/')
print(result.json())