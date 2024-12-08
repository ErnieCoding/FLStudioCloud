FROM python:3.9-slim 
WORKDIR /app

# Copy requirements.txt from the root directory
COPY ../requirements.txt .  

RUN pip install --no-cache-dir -r requirements.txt

COPY . .  # This copies the rest of the project files
EXPOSE 8000
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]


