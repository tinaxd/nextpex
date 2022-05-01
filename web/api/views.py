from django.http import JsonResponse
from rest_framework.response import Response
from . import serializers as ser
from rest_framework import mixins, status
from rest_framework import generics
from rest_framework.views import APIView
from web import models as wm
from rest_framework.decorators import api_view

# Create your views here.


class LevelUpdateView(APIView):
    def post(self, request):
        serializer = ser.LevelUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class RankUpdateView(APIView):
    def post(self, request):
        serializer = ser.RankUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class ApexabilityCheckView(APIView):
    def post(self, request):
        serializer = ser.ApexabilityCheckSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class CompatLevelUpdateView(APIView):
    def post(self, request):
        serializer = ser.CompatLevelUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class CompatRankUpdateView(APIView):
    def post(self, request):
        serializer = ser.CompatRankUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def rank(request):
    rank_raw = wm.RankUpdate.objects.all()
    serializer = ser.RankUpdateSerializer(rank_raw, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
def level(request):
    level_raw = wm.LevelUpdate.objects.all()
    serializer = ser.LevelUpdateSerializer(level_raw, many=True)
    return JsonResponse(serializer.data, safe=False)


@api_view(['GET'])
def check(request):
    raw = wm.ApexabilityCheck.objects.order_by('-time').all()
    serializer = ser.CheckSerializer(raw, many=True)
    return JsonResponse(serializer.data, safe=False)
