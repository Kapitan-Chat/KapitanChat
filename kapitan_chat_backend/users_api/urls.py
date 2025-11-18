from django.urls import path,include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

from .views import RegisterView, GetMe, Users, SearchApiView

router = DefaultRouter()


urlpatterns = [
    path('search/', SearchApiView.as_view(), name='search_user'),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('register/', RegisterView.as_view(), name='register'),
    path('me/', GetMe.as_view(), name='get_me'),
    path('<int:pk>', Users.as_view(), name='get_user'),

]

urlpatterns += router.urls