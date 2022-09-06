import 'package:flutter/material.dart';

class NowLoading extends StatelessWidget {
  const NowLoading({super.key});

  final String msg = "Loading...";

  @override
  Widget build(BuildContext context) {
    return Text(msg);
  }
}
