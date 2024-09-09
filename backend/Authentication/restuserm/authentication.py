from rest_framework.authentication import TokenAuthentication as BaseTokenAuthentication


class MyTokenAuthentication(BaseTokenAuthentication):
    def authenticate(self, request):
        keyword = "Bearer"
