from django.contrib import admin
from .models import Hotel, Bookmark

@admin.register(Hotel)
class HotelAdmin(admin.ModelAdmin):
    list_display = ('name', 'location', 'star_rating', 'has_pool', 'indicative_price')
    list_filter = ('star_rating', 'has_pool', 'location')
    search_fields = ('name', 'location', 'description')

@admin.register(Bookmark)
class BookmarkAdmin(admin.ModelAdmin):
    list_display = ('user', 'hotel', 'created_at')
    list_filter = ('user', 'created_at')