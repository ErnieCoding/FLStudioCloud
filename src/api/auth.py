from .models import Users
from django.core.exceptions import ObjectDoesNotExist
from rest_framework_simplejwt.authentication import JWTAuthentication
from rest_framework.exceptions import AuthenticationFailed

def authenticate_user(username: str, password: str) -> Users:
    try:
        user = Users.objects.get(username=username)
        if user.check_password(password):
            return user
    except ObjectDoesNotExist:
        pass
    return None

class CustomJWTAuthentication(JWTAuthentication):
    def get_user(self, validated_token):
        user_id = validated_token.get("user_id")
        if not user_id:
            raise AuthenticationFailed("Token contained no recognizable user ID", code="user_not_found")
        try:
            user = Users.objects.get(id=user_id)
        except Users.DoesNotExist:
            raise AuthenticationFailed("User not found", code="user_not_found")
        return user
