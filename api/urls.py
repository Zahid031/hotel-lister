from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

from accounts.views import RegisterView, UserProfileView,LoginView
from hotels.views import HotelViewSet, BookmarkViewSet, HotelSearchAPIView

router = DefaultRouter()
router.register(r'hotels', HotelViewSet, basename='hotel')
router.register(r'bookmarks', BookmarkViewSet, basename='bookmark')

urlpatterns = [
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', LoginView.as_view(), name='login'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('auth/profile/', UserProfileView.as_view(), name='user_profile'),
    
    path('search/hotels/', HotelSearchAPIView.as_view(), name='hotel_search'),
    
    path('', include(router.urls)),
]