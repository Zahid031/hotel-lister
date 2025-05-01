from rest_framework import serializers
from .models import Hotel, Bookmark

class HotelSerializer(serializers.ModelSerializer):
    is_bookmarked = serializers.SerializerMethodField()
    
    class Meta:
        model = Hotel
        fields = ('id', 'name', 'description', 'location', 'star_rating', 
                  'has_pool', 'indicative_price', 'image_url', 
                  'is_bookmarked')
    
    def get_is_bookmarked(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return Bookmark.objects.filter(user=request.user, hotel=obj).exists()
        return False

class BookmarkSerializer(serializers.ModelSerializer):
    hotel = HotelSerializer(read_only=True)
    hotel_id = serializers.IntegerField(write_only=True)
    
    class Meta:
        model = Bookmark
        fields = ('id', 'hotel', 'hotel_id', 'created_at')
        
    def create(self, validated_data):
        validated_data['user'] = self.context['request'].user
        return super().create(validated_data)