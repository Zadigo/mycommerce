import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    ThemeData theme = Theme.of(context);

    return Center(
        child: Container(
          height: 400,
          color: theme.colorScheme.primary,
          alignment: Alignment.topCenter,
          child: Image(image: AssetImage('images/img1.jpg'),),
        ),
      );
  }
}
