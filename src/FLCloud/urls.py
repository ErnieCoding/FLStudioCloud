from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from api.views import *

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/signup/', signup_view, name='signup'),
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/protected/', ProtectedView.as_view(), name='protected'),
    path('api/repositories/', get_repositories, name='get_repositories'),
    path('api/repositories/create/', create_repository, name='create_repository'),
    path('api/repositories/<int:repo_id>/files/', get_files, name='get_files'),
    path('api/repositories/<int:repo_id>/upload/', upload_files, name='upload_files'),
    path('api/repositories/<int:repo_id>/', get_repository_details, name='get_repository_details'),
]
