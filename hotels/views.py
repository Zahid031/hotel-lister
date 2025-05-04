import time
import random
from django.db.models import Q
from rest_framework import viewsets, permissions, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView
from django_filters.rest_framework import DjangoFilterBackend
import django_filters

from .models import Hotel, Bookmark
from .serializers import HotelSerializer, BookmarkSerializer

class HotelFilter(django_filters.FilterSet):
    min_price = django_filters.NumberFilter(field_name="indicative_price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="indicative_price", lookup_expr='lte')
    location = django_filters.CharFilter(field_name="location", lookup_expr='icontains')
    name = django_filters.CharFilter(field_name="name", lookup_expr='icontains')
    description = django_filters.CharFilter(field_name="description", lookup_expr='icontains')
    search = django_filters.CharFilter(method='search_fields')

    class Meta:
        model = Hotel
        fields = {
            'star_rating': ['exact', 'gte', 'lte'],
            'has_pool': ['exact'],
        }

    def search_fields(self, queryset, name, value):
        if value:
            return queryset.filter(
                Q(name__icontains=value) |
                Q(description__icontains=value) |
                Q(location__icontains=value)
            )
        return queryset

class HotelViewSet(viewsets.ModelViewSet):
    queryset = Hotel.objects.all()
    serializer_class = HotelSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    filterset_class = HotelFilter
    search_fields = ['name', 'description', 'location']
    ordering_fields = ['name', 'star_rating', 'indicative_price']
    ordering = ['name']

class HotelSearchAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        location = request.query_params.get('location', '')
        if not location:
            return Response({"error": "Location parameter is required"}, 
                          status=status.HTTP_400_BAD_REQUEST)
        hotels = Hotel.objects.filter(location__icontains=location)
        if not hotels.exists():
            try:
                hotels_data = self._fetch_hotel_data(location)
                for hotel_data in hotels_data:
                    Hotel.objects.create(
                        name=hotel_data['name'],
                        description=hotel_data['description'],
                        location=location,
                        star_rating=hotel_data['star_rating'],
                        has_pool=hotel_data['has_pool'],
                        indicative_price=hotel_data['price'],
                        image_url=hotel_data.get('image_url')
                    )
                hotels = Hotel.objects.filter(location__icontains=location)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        filterset = HotelFilter(request.query_params, queryset=hotels)
        filtered_hotels = filterset.qs
        search_query = request.query_params.get('q', None)
        if search_query:
            filtered_hotels = filtered_hotels.filter(
                Q(name__icontains=search_query) | 
                Q(description__icontains=search_query) |
                Q(location__icontains=search_query)
            )
        ordering = request.query_params.get('ordering', 'name')
        if ordering:
            if ordering.startswith('-'):
                ordering_field = ordering[1:]
                filtered_hotels = filtered_hotels.order_by(f"-{ordering_field}")
            else:
                filtered_hotels = filtered_hotels.order_by(ordering)
        serializer = HotelSerializer(filtered_hotels, many=True, context={'request': request})
        return Response(serializer.data)

    def _fetch_hotel_data(self, location):
        time.sleep(1)
        hotel_names = [
            "Grand Hotel", "Sunset Resort", "Ocean View", "Mountain Retreat", 
            "City Center Hotel", "Riverside Inn", "Plaza Hotel", "Royal Suite",
            "Blue Lagoon Resort", "Golden Sands Hotel"
        ]
        descriptions = [
            "A luxurious hotel with stunning views and exceptional service.",
            "Comfortable accommodations in the heart of the city.",
            "Experience tranquility and relaxation in our beautiful resort.",
            "Modern amenities combined with classic charm.",
            "The perfect getaway destination for families and couples alike."
        ]
        hotels = []
        for i in range(10):
            hotels.append({
                'name': f"{hotel_names[i]} {location}",
                'description': random.choice(descriptions),
                'star_rating': random.randint(3, 5),
                'has_pool': random.choice([True, False]),
                'price': round(random.uniform(80, 500), 2),
                'image_url': f"https://picsum.photos/id/{random.randint(1, 1000)}/300/200"
            })
        return hotels

class BookmarkViewSet(viewsets.ModelViewSet):
    serializer_class = BookmarkSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Bookmark.objects.filter(user=self.request.user)

    @action(detail=False, methods=['post'])
    def toggle(self, request):
        hotel_id = request.data.get('hotel_id')
        if not hotel_id:
            return Response({"error": "hotel_id is required"}, 
                            status=status.HTTP_400_BAD_REQUEST)
        try:
            bookmark = Bookmark.objects.get(user=request.user, hotel_id=hotel_id)
            bookmark.delete()
            return Response({"status": "removed"})
        except Bookmark.DoesNotExist:
            bookmark = Bookmark.objects.create(user=request.user, hotel_id=hotel_id)
            serializer = self.get_serializer(bookmark)
            return Response(serializer.data)