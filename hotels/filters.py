import django_filters
from .models import Hotel

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
                django_filters.Q(name__icontains=value) |
                django_filters.Q(description__icontains=value) |
                django_filters.Q(location__icontains=value)
            )
        return queryset