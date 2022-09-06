import 'package:charts_flutter/flutter.dart' as charts;
import 'package:flutter/material.dart';
import 'api_types.dart';
import 'request.dart';

import 'nowloading.dart';

class LevelChart extends StatelessWidget {
  const LevelChart({super.key, required this.levels});

  final AllLevelsResponse levels;
  final bool animate = true;

  List<charts.Series<LevelResponse, DateTime>> get series {
    List<charts.Series<LevelResponse, DateTime>> sers = [];
    final DateTime now = DateTime.now();
    for (var level in levels.levels.entries) {
      final username = level.key;
      final entries = List<LevelResponse>.from(level.value);

      // 現時刻のエントリを追加
      if (entries.isNotEmpty) {
        entries.insert(
            0,
            LevelResponse(
                level: entries.first.level,
                unixtime: now.millisecondsSinceEpoch ~/ 1000));
      }

      sers.add(charts.Series<LevelResponse, DateTime>(
        id: username,
        domainFn: (LevelResponse lr, _) => lr.time,
        measureFn: (LevelResponse lr, _) => lr.level,
        data: entries,
      ));
    }
    return sers;
  }

  @override
  Widget build(BuildContext context) {
    return charts.TimeSeriesChart(
      series,
      animate: animate,
      defaultRenderer: charts.LineRendererConfig(),
      customSeriesRenderers: [
        charts.PointRendererConfig(customRendererId: 'customPoint'),
      ],
    );
  }
}

class LevelChartOnline extends StatefulWidget {
  const LevelChartOnline({super.key, required this.client});

  final HttpClient client;

  @override
  State<LevelChartOnline> createState() => _LevelChartOnlineState();
}

class _LevelChartOnlineState extends State<LevelChartOnline> {
  AllLevelsResponse? levels;

  @override
  void initState() {
    super.initState();

    // fetch from net
    fetchLevels();
  }

  void fetchLevels() async {
    final r = await widget.client.getAllLevels();
    setState(() {
      levels = r;
    });
  }

  @override
  Widget build(BuildContext context) {
    return levels == null ? const NowLoading() : LevelChart(levels: levels!);
  }
}
