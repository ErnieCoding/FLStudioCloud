from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
import json
from django.views.decorators.csrf import csrf_exempt
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.exceptions import AuthenticationFailed
from .models import *
from .auth import *

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
            if Users.objects.filter(username=username).exists() or Users.objects.filter(email=email).exists():
                return JsonResponse({'success': False, 'message': 'Username or email is already in use.'}, status=400)
            user = Users(username=username, email=email, password=password)
            user.save()
            return JsonResponse({'success': True, 'message': 'User registered successfully!'}, status=201)
        except json.JSONDecodeError:
            return JsonResponse({'success': False, 'message': 'Invalid JSON payload.'}, status=400)
        except Exception as e:
            return JsonResponse({'success': False, 'message': str(e)}, status=500)
    return JsonResponse({'success': False, 'message': 'Invalid request method.'}, status=405)

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
            "user_id": user.id,
        }

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_repositories(request):
    try:
        user = request.user  # Fetch the authenticated user
        repositories = Projects.objects.filter(user=user)
        repo_list = [
            {
                "id": repo.id,
                "title": repo.title,
                "created_at": repo.created_at,
                "description": repo.description,
            }
            for repo in repositories
        ]
        return Response({"repositories": repo_list}, status=200)
    except Exception as e:
        return Response({"message": "Something went wrong while fetching repositories.", "error": str(e)}, status=500)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def create_repository(request):
    user_id = request.user.id
    data = request.data
    title = data.get('title')
    description = data.get('description', '')
    if not title:
        return Response({'detail': 'Repository title is required.', 'code': 'title_missing'}, status=400)
    try:
        repo = Projects.objects.create(user_id_id=user_id, title=title, description=description)
        return Response({
            "id": repo.id,
            "title": repo.title,
            "created_at": repo.created_at,
            "description": repo.description,
        }, status=201)
    except Exception as e:
        return Response({'detail': 'An error occurred while creating the repository.', 'code': 'creation_error'}, status=500)

class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "You are authenticated!"})