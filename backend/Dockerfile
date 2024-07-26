# Dockerfile for backend
FROM python:3.9-slim

# 환경 변수 설정
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

WORKDIR /app

COPY requirements.txt ./
RUN pip install --upgrade pip && pip install -r requirements.txt

COPY . .

CMD ["gunicorn", "--workers=3", "--bind", "0.0.0.0:8000", "transcendence.wsgi:application"]
