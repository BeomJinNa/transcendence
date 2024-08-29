from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from .serializers import UserSerializer
from main.customEmail import send_custom_email
import os
import logging
import requests
logger = logging.getLogger('mylogger')

User = get_user_model()
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')

def send2FAcode(user, baseurl):
    tempToken = str(RefreshToken.for_user(user))
    link = f"{baseurl}/login?t={tempToken}"
    logger.info(f"2FA code link: {link}")
    send_custom_email(
        '인증링크',
        f'<a href={link}>주소를</a> 클릭해주세요',
        'from server',
        [user.email],
        smtp_user=EMAIL_HOST_USER,          # SMTP 사용자 이메일
        smtp_password=EMAIL_HOST_PASSWORD   # SMTP 비밀번호
    )

# Oauth2.0 code grant flow
class Oauth2LoginView(APIView):
    def post(self, request):
        # 프론트엔드에서 전송된 인증 코드
        auth_code = request.data.get("code")
        logger.info(f"auth_code: {auth_code}")
        baseurl = request.data.get("baseurl")
        logger.info(f"baseurl: {baseurl}")
        if not auth_code:
            return Response({"error": "Authorization code not provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        logger.info(f"auth_code: {auth_code}")

        # 42 oauth에 요청하여 access token 획득
        token_url = 'https://api.intra.42.fr/oauth/token'
        client_id = os.getenv('OAUTH_42_CLIENT_ID')
        client_secret = os.getenv('OAUTH_42_CLIENT_SECRET')
        tokenResponse = requests.post(token_url, data={
            'grant_type': 'authorization_code',
            'client_id': client_id,
            'client_secret': client_secret,
            'code': auth_code,
            'redirect_uri': baseurl + '/login'
        })
        logger.info(f"tokenResponse: {tokenResponse}")
        tokenResponse = tokenResponse.json()
        logger.info(f"tokenResponse: {tokenResponse}")

        # 사용자를 식별하고 생성 또는 업데이트
        user_info = requests.get('https://api.intra.42.fr/v2/me', headers={'Authorization': f'Bearer {tokenResponse["access_token"]}'})
        logger.info(f"user_info: {user_info}")
        user_info = user_info.json()
        logger.info(f"user_info: {user_info}")
        username = user_info['login']
        email = user_info['email']
        user, created = User.objects.get_or_create(username=username, email=email)
        if created:
            user.save()

        # 2FA 코드 전송
        send2FAcode(user=user, baseurl=baseurl)
        return Response(status=status.HTTP_200_OK)

# 2FA 코드 검증
class Verify2FAcode(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        token = request.data.get('token')  # 받은 토큰

        try:
            # 토큰 확인
            refresh = RefreshToken(token)  # 토큰이 유효한지 확인
            user = User.objects.get(id=refresh.payload['user_id'])  # 사용자 확인

            # 성공적으로 인증된 경우
            new_refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(new_refresh),
                'access': str(new_refresh.access_token)
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            print(f"Error: {str(e)}")
            return Response({'detail': "유효하지 않은 토큰입니다."}, status=status.HTTP_400_BAD_REQUEST)

# 토큰 갱신
class RefreshView(APIView):
    authentication_classes = []
    permission_classes = []

    def post(self, request):
        refresh_token = request.data.get('refresh_token')
    
        if not refresh_token:
            return Response({'detail': "리프레시 토큰이 필요합니다."}, status=status.HTTP_400_BAD_REQUEST)
    
        try:
            token = RefreshToken(refresh_token)
            user = User.objects.get(id=token.payload['user_id'])
            new_refresh = RefreshToken.for_user(user)

            return Response({
                'refresh': str(new_refresh),
                'access': str(new_refresh.access_token)
            }, status=status.HTTP_200_OK)
        
        except Exception as e:
            print(f"Error: {str(e)}")
            return Response({'detail': "유효하지 않은 토큰입니다."}, status=status.HTTP_400_BAD_REQUEST)


class MyselfView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        if (user.is_authenticated):
            return Response({ 'username': user.username, 'email': user.email }, status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
