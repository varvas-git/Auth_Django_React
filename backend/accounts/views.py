from django.shortcuts import render
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.generics import GenericAPIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .serializers import *


class UserRegistrationAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserRegistrationSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        token = RefreshToken.for_user(user)
        data = serializer.data
        data['token'] = {'refresh': str(token), 'access': str(token.access_token)}
        return Response(data, status=status.HTTP_201_CREATED)

class UserLoginAPIView(GenericAPIView):
    permission_classes = (AllowAny,)
    serializer_class = UserLoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        serializer = CustomUserSerializer(user)
        token = RefreshToken.for_user(user)
        data = serializer.data
        data['token'] = {'refresh': str(token), 'access': str(token.access_token)}
        return Response(data, status=status.HTTP_200_OK)

class UserLogoutAPIView(GenericAPIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        try:
            # Проверяем наличие refresh токена в запросе
            if 'refresh' not in request.data:
                return Response(
                    {"error": "Отсутствует refresh token в запросе"},
                    status=status.HTTP_400_BAD_REQUEST
                )
            refresh_token = request.data['refresh']
            # Добавляем токен в черный список
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response(
                {"detail": "Успешный выход из системы"},
                status=status.HTTP_205_RESET_CONTENT
            )
        except Exception as e:
            # Логирование ошибки (в реальном приложении)
            # logger.error(f"Ошибка при выходе из системы: {str(e)}")

            return Response(
                {"error": "Не удалось обработать запрос на выход из системы"},
                status=status.HTTP_400_BAD_REQUEST
            )


class UserProfileView(GenericAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        serializer = CustomUserSerializer(request.user)
        return Response(serializer.data)