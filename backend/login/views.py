from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from django.core.mail import send_mail
from django.utils.crypto import get_random_string
from django.utils import timezone
from .models import TwoFactorCode
from .serializers import UserSerializer
from main.customEmail import send_custom_email

User = get_user_model()
EMAIL_HOST_USER = 'dlsfuf0316@gmail.com'
EMAIL_HOST_PASSWORD = 'kukj wxpb bizi bgbx'

# JWT 로그인 + 2FA 코드 발송
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            code = get_random_string(length=6, allowed_chars='0123456789')  # 코드
            limited_time = timezone.now() + timezone.timedelta(minutes=5)  # 제한시간
            TwoFactorCode.objects.create(user=user, code=code, expiration=limited_time)

            send_custom_email(
                'Your 2FA code',
                f'Your 2FA code is: {code}',
                'from server',
                [user.email],
                smtp_user=EMAIL_HOST_USER,          # SMTP 사용자 이메일
                smtp_password=EMAIL_HOST_PASSWORD   # SMTP 비밀번호
            )
            return Response({'detail': "2FA 코드가 이메일로 전송됨"}, status=status.HTTP_200_OK)
        return Response({'detail': "사용자 인증 실패"}, status=status.HTTP_400_BAD_REQUEST)

# 2FA 코드 검증
class Verify2FAcode(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        code = request.data.get('code')
        user = User.objects.get(username=username)

        try:
            valid_code = TwoFactorCode.objects.get(user=user, code=code)
            if valid_code.is_valid():
                refresh = RefreshToken.for_user(user)
                valid_code.delete()  # 사용된 코드 삭제
                return Response({
                    'refresh': str(refresh),
                    'access': str(refresh.access_token)
                }, status=status.HTTP_200_OK)
            else:
                return Response({'detail': "코드가 유효하지 않거나 만료되었습니다."}, status=status.HTTP_400_BAD_REQUEST)
        except TwoFactorCode.DoesNotExist:
            return Response({'detail': "코드가 잘못되었습니다."}, status=status.HTTP_400_BAD_REQUEST)

# 로그아웃
class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if not refresh_token:
                return Response({'detail': "리프레시 토큰이 필요합니다."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                token = RefreshToken(refresh_token) # RefreshToken 인스턴스 생성
                token.blacklist()                   # 블랙리스트에 추가
            except Exception as e:
                return Response({'detail': "유효하지 않은 토큰입니다."}, status=status.HTTP_400_BAD_REQUEST)

            return Response({'detail': "로그아웃 성공"}, status=status.HTTP_200_OK)
        except Exception as e:
            # 예외 메시지 출력
            print(f"Error: {str(e)}")
            return Response({'detail': "로그아웃 실패"}, status=status.HTTP_400_BAD_REQUEST)

class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)