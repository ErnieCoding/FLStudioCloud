from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed
from .models import Users
from .auth import authenticate_user

# Signup View
@csrf_exempt
def signup_view(request):
    if request.method == 'POST':
        try:
            body = json.loads(request.body)
            username = body.get('username')
            email = body.get('email')
            password = body.get('password')

            if not username or not email or not password:
                return JsonResponse({'success': False, 'message': 'All fields are required.'}, status=400)

            if Users.objects.filter(username=username).exists():
                return JsonResponse({'success': False, 'message': 'Username is already in use.'}, status=400)
            if Users.objects.filter(email=email).exists():
                return JsonResponse({'success': False, 'message': 'Email is already in use.'}, status=400)

            user = Users(username=username, email=email, password=password)
            user.save()
            return JsonResponse({'success': True, 'message': 'User registered successfully!'}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON payload.'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)

    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)


# Custom Token Obtain Pair View
class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        return token

    def validate(self, attrs):
        username = attrs.get("username")
        password = attrs.get("password")
        user = authenticate_user(username, password)

        if not user:
            raise AuthenticationFailed("Invalid username or password")

        refresh = RefreshToken.for_user(user)
        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }


class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer


# Protected Route View
class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "You are authenticated!"})
