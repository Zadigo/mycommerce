from functools import wraps
from rest_framework.response import Response
from rest_framework import status

def base_response(func):
    # @wraps(func)
    def response(serializer=None, data=None, **kwargs):
        if serializer is not None and data is None:
            data = serializer.data
        elif serializer is not None and data is not None:
            data = serializer.data
        return func(data, **kwargs)
    return response


@base_response
def success_response(data, **kwargs):
    return Response(data=data, status=status.HTTP_200_OK, **kwargs)


@base_response
def not_found_response(data, **kwargs):
    return Response(data=data, status=status.HTTP_404_NOT_FOUND, **kwargs)


@base_response
def created_response(data, **kwargs):
    return Response(data=data, status=status.HTTP_201_CREATED, **kwargs)
