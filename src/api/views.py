from django.http import JsonResponse
import json
from .auth import authenticate_user
from django.views.decorators.csrf import csrf_exempt

# Create your views here.

@csrf_exempt
def login_view(request):
    
    if request.method == 'POST':
        print("POST request received!")
    else:
        print("Only POST requests are allowed")
    

    if request.method == "POST":
        body = json.loads(request.body)
        username = body.get('username')
        password = body.get('password')

        if authenticate_user(username, password):
            return JsonResponse({'success':True, 'message':'Login Successful!'}, status = 200)
        else:
            return JsonResponse({'success':False, 'message':'Invalid username or password'}, status = 401)

    return JsonResponse({'error': 'Invalid request method'}, status=400)