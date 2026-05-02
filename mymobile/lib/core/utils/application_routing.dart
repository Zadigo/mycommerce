// import 'dart:developer';

import 'package:flutter/widgets.dart';
import 'package:mymobile/features/account/screens/account_index_screen.dart';
import 'package:mymobile/features/home/screens/home_screen.dart';

class ApplicationRouting {
  int currentIndex = 0;
  final Map<String, WidgetBuilder> routeMap = {
    '/': (context) => const HomeScreen(),
    '/account': (context) => const AccountIndexScreen(),
  };

  List<String> getNames() {
    return routeMap.keys.toList();
  }

  WidgetBuilder getRouteByIndex() {
    final values = routeMap.values.toList();
      // log('Current Index: $currentIndex, $values');
    return values.elementAt(currentIndex);
  }

  void setRouteIndex(int index) {
    currentIndex = index;
    // log('Set Index: $currentIndex');
  }
}
