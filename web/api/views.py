from django.http import JsonResponse, HttpResponseNotFound
from rest_framework.response import Response
from . import serializers as ser
from rest_framework import mixins, status
from rest_framework import generics
from rest_framework.views import APIView
from web import models as wm
from rest_framework.decorators import api_view
from django.views.decorators.cache import cache_control
from django.core.cache import cache
from . import cache_keys as ck

# Create your views here.


class LevelUpdateView(APIView):
    def post(self, request):
        serializer = ser.LevelUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            cache.delete(ck.LEVEL_UPDATE_KEY)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class RankUpdateView(APIView):
    def post(self, request):
        serializer = ser.RankUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            cache.delete(ck.RANK_UPDATE_KEY)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class ApexabilityCheckView(APIView):
    def post(self, request):
        serializer = ser.ApexabilityCheckSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            cache.delete(ck.GAME_CHECK_KEY)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class CompatLevelUpdateView(APIView):
    def post(self, request):
        serializer = ser.CompatLevelUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            cache.delete(ck.LEVEL_UPDATE_KEY)
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


class CompatRankUpdateView(APIView):
    def post(self, request):
        serializer = ser.CompatRankUpdateSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            cache.delete(ck.RANK_UPDATE_KEY)
            return Response(status=status.HTTP_200_OK)
        return Response(status=status.HTTP_400_BAD_REQUEST)


@cache_control(public=True, max_age=60)
@api_view(['GET'])
def rank(request):
    cache_res = cache.get(ck.RANK_UPDATE_KEY)
    if cache_res:
        return JsonResponse(cache_res, safe=False)

    rank_raw = wm.RankUpdate.objects.all()
    serializer = ser.RankUpdateSerializer(rank_raw, many=True)
    cache.set(ck.RANK_UPDATE_KEY, serializer.data)
    return JsonResponse(serializer.data, safe=False)


@cache_control(public=True, max_age=60)
@api_view(['GET'])
def level(request):
    cache_res = cache.get(ck.LEVEL_UPDATE_KEY)
    if cache_res:
        return JsonResponse(cache_res, safe=False)

    level_raw = wm.LevelUpdate.objects.all()
    serializer = ser.LevelUpdateSerializer(level_raw, many=True)
    cache.set(ck.LEVEL_UPDATE_KEY, serializer.data)
    return JsonResponse(serializer.data, safe=False)


@cache_control(public=True, max_age=60)
@api_view(['GET'])
def check(request):
    cache_res = cache.get(ck.GAME_CHECK_KEY)
    if cache_res:
        return JsonResponse(cache_res, safe=False)

    raw = wm.ApexabilityCheck.objects.order_by('-time').all()
    serializer = ser.CheckSerializer(raw, many=True)
    cache.set(ck.GAME_CHECK_KEY, serializer.data)
    return JsonResponse(serializer.data, safe=False)
