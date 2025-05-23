from rest_framework.permissions import BasePermission, SAFE_METHODS, IsAuthenticated


class CanAlterAccount(BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in SAFE_METHODS:
            return True
        return obj.id == request.user.id


class CustomIsAuthenticated(IsAuthenticated):
    """Custom permission that also checks if the
    is currently active"""
    
    def has_permission(self, request, view):
        result = super().has_permission(request, view)
        return all([request.user.is_active, result])
