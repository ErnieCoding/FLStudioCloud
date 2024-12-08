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

            #Check for missing fields
            if not username or not email or not password:
                return JsonResponse({'success': False, 'message': 'All fields are required.'}, status=400)
            
            #Check for existing users email and/or username
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
    try:
        user = request.user  # Use the authenticated user directly
        data = request.data
        title = data.get('title')
        description = data.get('description', '')

        if not title:
            return Response({'detail': 'Repository title is required.', 'code': 'title_missing'}, status=400)

        # Create the repository
        repo = Projects.objects.create(user=user, title=title, description=description)
        return Response({
            "id": repo.id,
            "title": repo.title,
            "created_at": repo.created_at,
            "description": repo.description,
        }, status=201)
    except Exception as e:
        print(f"Error in create_repository: {e}")  # Log the error for debugging
        return Response({'detail': 'An error occurred while creating the repository.', 'code': 'creation_error'}, status=500)


class ProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "You are authenticated!"})

#Handle file retrieval and upload
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_files(request, repo_id):
    """
    Fetch files for a specific repository.
    """
    try:
        # Ensure the repository exists and belongs to the user
        repository = Projects.objects.get(id=repo_id, user=request.user)

        # Query files associated with the repository
        files = Files.objects.filter(project_id=repository)
        file_list = [
            {
                "id": file.id,
                "file_name": file.file_name,
                "file_size": file.file_size,
                "file_url": file.file_url,
                "file_type": file.file_type,
                "created_at": file.created_at,
                "updated_at": file.updated_at,
            }
            for file in files
        ]
        return Response({"files": file_list}, status=200)
    except Projects.DoesNotExist:
        return Response(
            {"message": "Repository not found or you do not have access."}, status=404
        )
    except Exception as e:
        print(f"Error in get_files: {e}")
        return Response({"message": "An error occurred while fetching files."}, status=500)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_repository_details(request, repo_id):
    """
    Fetch repository details by ID.
    """
    try:
        repository = Projects.objects.get(id=repo_id, user=request.user)
        return Response({
            "id": repository.id,
            "title": repository.title,
            "description": repository.description,
            "created_at": repository.created_at,
        }, status=200)
    except Projects.DoesNotExist:
        return Response({"message": "Repository not found or you do not have access."}, status=404)
    except Exception as e:
        print(f"Error in get_repository_details: {e}")
        return Response({"message": "An error occurred while fetching repository details."}, status=500)
    

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def upload_files(request, repo_id):
    """
    Handle file upload and save metadata for a specific repository.
    """
    try:
        # Ensure the repository exists and belongs to the user
        repository = Projects.objects.get(id=repo_id, user=request.user)

        # Process the uploaded files metadata
        files = request.FILES.getlist("files")
        uploaded_files = []
        for file in files:
            new_file = Files.objects.create(
                project_id=repository,
                user_id=request.user,
                file_name=file.name,
                file_size=file.size,
                file_type=file.content_type,
                file_url=None,  # Replace with actual URL if needed
            )
            uploaded_files.append(
                {
                    "id": new_file.id,
                    "file_name": new_file.file_name,
                    "file_size": new_file.file_size,
                    "file_type": new_file.file_type,
                    "created_at": new_file.created_at,
                }
            )

        return Response({"files": uploaded_files}, status=201)
    except Projects.DoesNotExist:
        return Response(
            {"message": "Repository not found or you do not have access."}, status=404
        )
    except Exception as e:
        print(f"Error in upload_files: {e}")
        return Response({"message": "An error occurred while uploading files."}, status=500)
