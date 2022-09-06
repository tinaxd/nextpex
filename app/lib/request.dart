import 'dart:convert';

import 'package:dio/dio.dart';
import 'package:flutter/foundation.dart';
import 'api_types.dart';

class HttpClient {
  final Dio _dio = Dio();

  static const String baseURL = "http://localhost:2500";

  String _makeURL(String endpoint) {
    return "$baseURL$endpoint";
  }

  Future<AllLevelsResponse> getAllLevels() async {
    final response = await _dio.get(_makeURL("/level/all"));
    return AllLevelsResponse.fromJson(response.data);
  }
}
