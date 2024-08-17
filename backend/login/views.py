from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.token_blacklist.models import BlacklistedToken
from rest_framework import status
from django.contrib.auth import authenticate, get_user_model
from .serializers import UserSerializer

# Create your views here.
class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        user = authenticate(request, username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }, status=status.HTTP_200_OK)
        return Response({'detail': "로그인 실패"}, status=status.HTTP_400_BAD_REQUEST)

class LogoutView(APIView):
    def post(self, request):
        try:
            refresh_token = request.data.get('refresh_token')
            if not refresh_token:
                return Response({'detail': "리프레시 토큰이 필요합니다."}, status=status.HTTP_400_BAD_REQUEST)

            try:
                # RefreshToken 인스턴스 생성
                token = RefreshToken(refresh_token)
                # 블랙리스트에 추가
                token.blacklist()
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