# import requests
# import json
# import os
# import time
# import random
# from django.db.models import Q
# from rest_framework import viewsets, permissions, status
# from rest_framework.decorators import action
# from rest_framework.response import Response
# from rest_framework.views import APIView

# from .models import Hotel, Bookmark
# from .serializers import HotelSerializer, BookmarkSerializer

# class HotelViewSet(viewsets.ModelViewSet):
#     queryset = Hotel.objects.all()
#     serializer_class = HotelSerializer
#     permission_classes = [permissions.AllowAny]
    
#     def get_queryset(self):
#         queryset = Hotel.objects.all()
        
#         # Filter by location
#         location = self.request.query_params.get('location', None)
#         if location:
#             queryset = queryset.filter(location__icontains=location)
        
#         # Filter by star rating
#         star_rating = self.request.query_params.get('star_rating', None)
#         if star_rating:
#             queryset = queryset.filter(star_rating=star_rating)
        
#         # Filter by pool availability
#         has_pool = self.request.query_params.get('has_pool', None)
#         if has_pool is not None:
#             has_pool_bool = has_pool.lower() == 'true'
#             queryset = queryset.filter(has_pool=has_pool_bool)
            
#         return queryset

# class HotelSearchAPIView(APIView):
#     permission_classes = [permissions.AllowAny]
    
#     def get(self, request):
#         """Search for hotels and fetch data from external API if needed"""
#         location = request.query_params.get('location', '')
#         star_rating = request.query_params.get('star_rating', None)
#         has_pool = request.query_params.get('has_pool', None)
        
#         if not location:
#             return Response({"error": "Location parameter is required"}, 
#                             status=status.HTTP_400_BAD_REQUEST)
        
#         # Check if we already have hotels for this location
#         hotels = Hotel.objects.filter(location__icontains=location)
        
#         # If we don't have any hotels for this location, fetch them
#         if not hotels.exists():
#             try:
#                 # Simulate fetching hotel data from external API
#                 hotels_data = self._fetch_hotel_data(location)
                
#                 # Save the fetched hotels to our database
#                 for hotel_data in hotels_data:
#                     Hotel.objects.create(
#                         name=hotel_data['name'],
#                         description=hotel_data['description'],
#                         location=location,
#                         star_rating=hotel_data['star_rating'],
#                         has_pool=hotel_data['has_pool'],
#                         indicative_price=hotel_data['price'],
#                         image_url=hotel_data.get('image_url')
#                     )
                
#                 # Refresh the query
#                 hotels = Hotel.objects.filter(location__icontains=location)
#             except Exception as e:
#                 return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
#         # Apply filters
#         if star_rating:
#             hotels = hotels.filter(star_rating=star_rating)
        
#         if has_pool is not None:
#             has_pool_bool = has_pool.lower() == 'true'
#             hotels = hotels.filter(has_pool=has_pool_bool)
        
#         serializer = HotelSerializer(hotels, many=True, context={'request': request})
#         return Response(serializer.data)
    
#     def _fetch_hotel_data(self, location):
#         """
#         Simulate fetching hotel data from an external API
#         In a real implementation, this would make actual API calls
#         """
#         # Simulate API delay
#         time.sleep(1)
        
#         # Generate random hotel data
#         hotel_names = [
#             "Grand Hotel", "Sunset Resort", "Ocean View", "Mountain Retreat", 
#             "City Center Hotel", "Riverside Inn", "Plaza Hotel", "Royal Suite",
#             "Blue Lagoon Resort", "Golden Sands Hotel"
#         ]
        
#         descriptions = [
#             "A luxurious hotel with stunning views and exceptional service.",
#             "Comfortable accommodations in the heart of the city.",
#             "Experience tranquility and relaxation in our beautiful resort.",
#             "Modern amenities combined with classic charm.",
#             "The perfect getaway destination for families and couples alike."
#         ]
        
#         hotels = []
#         for i in range(10):  # Generate 10 random hotels
#             hotels.append({
#                 'name': f"{hotel_names[i]} {location}",
#                 'description': random.choice(descriptions),
#                 'star_rating': random.randint(3, 5),
#                 'has_pool': random.choice([True, False]),
#                 'price': round(random.uniform(80, 500), 2),
#                 'image_url': f"https://picsum.photos/id/{random.randint(1, 1000)}/300/200"
#             })
        
#         return hotels

# class BookmarkViewSet(viewsets.ModelViewSet):
#     serializer_class = BookmarkSerializer
#     permission_classes = [permissions.IsAuthenticated]
    
#     def get_queryset(self):
#         return Bookmark.objects.filter(user=self.request.user)
    
#     @action(detail=False, methods=['post'])
#     def toggle(self, request):
#         hotel_id = request.data.get('hotel_id')
#         if not hotel_id:
#             return Response({"error": "hotel_id is required"}, 
#                             status=status.HTTP_400_BAD_REQUEST)
        
#         try:
#             bookmark = Bookmark.objects.get(user=request.user, hotel_id=hotel_id)
#             bookmark.delete()
#             return Response({"status": "removed"})
#         except Bookmark.DoesNotExist:
#             bookmark = Bookmark.objects.create(user=request.user, hotel_id=hotel_id)
#             serializer = self.get_serializer(bookmark)
#             return Response(serializer.data)

import requests
import json
import os
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


# Custom Filter for Hotels
class HotelFilter(django_filters.FilterSet):
    # Price range filters
    min_price = django_filters.NumberFilter(field_name="indicative_price", lookup_expr='gte')
    max_price = django_filters.NumberFilter(field_name="indicative_price", lookup_expr='lte')
    
    # Text search filters with case-insensitive containment
    location = django_filters.CharFilter(field_name="location", lookup_expr='icontains')
    name = django_filters.CharFilter(field_name="name", lookup_expr='icontains')
    description = django_filters.CharFilter(field_name="description", lookup_expr='icontains')
    
    # More complex search - search in multiple fields at once
    search = django_filters.CharFilter(method='search_fields')
    
    class Meta:
        model = Hotel
        fields = {
            'star_rating': ['exact', 'gte', 'lte'],
            'has_pool': ['exact'],
        }
    
    def search_fields(self, queryset, name, value):
        """
        Search across multiple fields at once
        """
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
    
    # Add the filter backends
    filter_backends = [
        DjangoFilterBackend,
        filters.SearchFilter,
        filters.OrderingFilter,
    ]
    
    # Use the custom filter class
    filterset_class = HotelFilter
    
    # Define fields for the built-in search functionality
    search_fields = ['name', 'description', 'location']
    
    # Define fields that can be used for ordering
    ordering_fields = ['name', 'star_rating', 'indicative_price']
    ordering = ['name']  # Default ordering


class HotelSearchAPIView(APIView):
    permission_classes = [permissions.AllowAny]
    
    def get(self, request):
        """Search for hotels and fetch data from external API if needed"""
        # Get the location parameter, which is required
        location = request.query_params.get('location', '')
        
        if not location:
            return Response({"error": "Location parameter is required"}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Check if we already have hotels for this location
        hotels = Hotel.objects.filter(location__icontains=location)
        
        # If we don't have any hotels for this location, fetch them
        if not hotels.exists():
            try:
                # Simulate fetching hotel data from external API
                hotels_data = self._fetch_hotel_data(location)
                
                # Save the fetched hotels to our database
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
                
                # Refresh the query
                hotels = Hotel.objects.filter(location__icontains=location)
            except Exception as e:
                return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Apply filtering based on query parameters
        filterset = HotelFilter(request.query_params, queryset=hotels)
        filtered_hotels = filterset.qs
        
        # Additional manual filtering for parameters not handled by django-filter
        search_query = request.query_params.get('q', None)
        if search_query:
            filtered_hotels = filtered_hotels.filter(
                Q(name__icontains=search_query) | 
                Q(description__icontains=search_query) |
                Q(location__icontains=search_query)
            )
        
        # Sorting/ordering
        ordering = request.query_params.get('ordering', 'name')
        if ordering:
            if ordering.startswith('-'):
                ordering_field = ordering[1:]
                filtered_hotels = filtered_hotels.order_by(f"-{ordering_field}")
            else:
                filtered_hotels = filtered_hotels.order_by(ordering)
        
        # Serialize and return
        serializer = HotelSerializer(filtered_hotels, many=True, context={'request': request})
        return Response(serializer.data)
    
    def _fetch_hotel_data(self, location):
        """
        Simulate fetching hotel data from an external API
        In a real implementation, this would make actual API calls
        """
        # Simulate API delay
        time.sleep(1)
        
        # Generate random hotel data
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
        for i in range(10):  # Generate 10 random hotels
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