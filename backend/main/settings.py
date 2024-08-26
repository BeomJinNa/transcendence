from pathlib import Path
from datetime import timedelta
import os

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = 'django-insecure-fw!q8)*yctyswg31yp*9nu0=8n2v76&2c27*0+f-(rhmft+$^y'

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

# ALLOWED_HOSTS = ['127.0.0.1', 'localhost']
ALLOWED_HOSTS = ['*']

# 2FA 이메일 관련 코드
EMAIL_BACKEND = 'django.core.mail.backends.smtp.EmailBackend'
EMAIL_HOST = 'smtp.gmail.com'
EMAIL_PORT = 587
EMAIL_USE_TLS = True
EMAIL_HOST_USER = os.getenv('EMAIL_HOST_USER')
EMAIL_HOST_PASSWORD = os.getenv('EMAIL_HOST_PASSWORD')

# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    # rest 관련
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework_simplejwt.token_blacklist',
    # Apps
    'login',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

# CORS 관련 설정
CORS_ALLOW_ALL_ORIGINS = True
CORS_ALLOWED_ORIGINS = os.getenv('DJANGO_CORS_ALLOWED_ORIGINS').split(',')
CORS_ALLOW_CREDENTIALS = True
# CORS_ALLOWED_ORIGINS = [
#     "https://localhost",
#     "http://localhost"
# ]
# CORS_ALLOW_HEADERS = (
#     "accept",
#     "authorization",
#     "content-type",
#     "user-agent",
#     "x-csrftoken",
#     "x-requested-with",
# )


ROOT_URLCONF = 'main.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

# REST framework 설정
REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    ),
}

WSGI_APPLICATION = 'main.wsgi.application'


# JWT 관련 설정
SIMPLE_JWT = {
    # 액세스 토큰의 유효 기간을 설정합니다. 여기서는 15분으로 설정되어 있습니다.
    'ACCESS_TOKEN_LIFETIME': timedelta(minutes=15),
    # 리프레시 토큰의 유효 기간을 설정합니다. 여기서는 1일로 설정되어 있습니다.
    'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
    # 리프레시 토큰을 새로 고침할 때마다 새 토큰으로 회전(갱신)할지 여부를 설정합니다.
    # False로 설정하면 토큰이 갱신되지 않으며, True로 설정하면 새로 갱신된 리프레시 토큰이 발급됩니다.
    'ROTATE_REFRESH_TOKENS': False,
    # 토큰 회전 후 이전 리프레시 토큰을 블랙리스트에 추가하여 사용할 수 없게 만듭니다.
    'BLACKLIST_AFTER_ROTATION': True,
    # JWT 토큰을 서명하는 데 사용할 알고리즘을 설정합니다. 기본값은 HS256 (HMAC SHA-256)입니다.
    'ALGORITHM': 'HS256',
    # JWT 토큰을 서명하는 데 사용할 비밀 키를 설정합니다. 이 키는 외부에 노출되지 않도록 주의해야 합니다.
    'SIGNING_KEY': 'your_secret_key',
    # Authorization 헤더에서 사용할 토큰 타입을 설정합니다. 기본값은 'Bearer'입니다.
    'AUTH_HEADER_TYPES': ('Bearer',),
    # HTTP 요청 헤더에서 JWT를 찾을 때 사용할 헤더 이름을 설정합니다.
    'AUTH_HEADER_NAME': 'HTTP_AUTHORIZATION',
    # 사용자 모델에서 JWT에 포함할 사용자 ID 필드를 설정합니다. 기본적으로 'id' 필드가 사용됩니다.
    'USER_ID_FIELD': 'id',
    # JWT 페이로드에 사용자 ID를 저장할 클레임(Claim) 이름을 설정합니다.
    'USER_ID_CLAIM': 'user_id',
    # 사용할 인증 토큰 클래스(들)을 설정합니다. 기본적으로 AccessToken 클래스가 사용됩니다.
    'AUTH_TOKEN_CLASSES': ('rest_framework_simplejwt.tokens.AccessToken',),
    # JWT 페이로드에 저장할 토큰 타입 클레임의 이름을 설정합니다.
    'TOKEN_TYPE_CLAIM': 'token_type',
}


# Database
# https://docs.djangoproject.com/en/5.1/ref/settings/#databases

DATABASES = {
    # 'default': {
    #     'ENGINE': 'django.db.backends.sqlite3',
    #     'NAME': BASE_DIR / 'db.sqlite3',
    # }, 
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB'),           # 사용할 데이터베이스 이름
        'USER': os.getenv('POSTGRES_USER'),         # 데이터베이스 사용자
        'PASSWORD': os.getenv('POSTGRES_PASSWORD'), # 사용자 비밀번호
        'HOST': 'postgres',                        # 데이터베이스 호스트 (로컬에서는 'localhost')
        'PORT': '5432',                             # 데이터베이스 포트 (기본값은 5432)
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.1/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.1/howto/static-files/

STATIC_URL = 'static/'

# Default primary key field type
# https://docs.djangoproject.com/en/5.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'loggers': {
        'mylogger': {
            'handlers': ['console'],
            'level': os.getenv('DJANGO_LOG_LEVEL', 'INFO'),
        },
    },
}