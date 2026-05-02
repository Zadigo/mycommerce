import 'package:flutter/material.dart';

class BaseNavigationWidget extends StatelessWidget {
  const BaseNavigationWidget({
    super.key,
    // required this.routing,
  });

  // final ApplicationRouting routing;

  @override
  Widget build(BuildContext context) {

    return BottomNavigationBar(
      currentIndex: 0,
      // onTap: routing.setRouteIndex,
      items: const [
        BottomNavigationBarItem(
          icon: Icon(Icons.home),
          label: 'Home',
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.account_circle),
          label: 'Account',
        ),
      ],
    );
  }
}
