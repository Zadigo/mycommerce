import 'package:flutter/material.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  @override
  Widget build(BuildContext context) {
    ThemeData theme = Theme.of(context);

    return ListView(
      children: [
        Container(
          height: 500,
          color: theme.colorScheme.primary,
          alignment: Alignment.topCenter,
          child: Image(
            width: 550,
            image: AssetImage('assets/images/img1.jpg'),
            fit: BoxFit.cover,
          ),
        ),
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceAround,
          children: [
            Container(
              height: 200,
              width: 200,
              color: theme.colorScheme.primaryContainer,
              alignment: Alignment.center,
              margin: EdgeInsets.only(top: 8),
              child: Image(
                width: 550,
                image: AssetImage('assets/images/img1.jpg'),
                fit: BoxFit.cover,
              ),
            ),
            Container(
              height: 200,
              width: 200,
              color: theme.colorScheme.primaryContainer,
              alignment: Alignment.center,
              margin: EdgeInsets.only(top: 8),
              child: Image(
                width: 550,
                image: AssetImage('assets/images/img1.jpg'),
                fit: BoxFit.cover,
              ),
            ),
          ],
        ),
        Container(
          height: 500,
          color: theme.colorScheme.primary,
          alignment: Alignment.topCenter,
          margin: EdgeInsets.only(top: 8),
          child: Image(
            width: 550,
            image: AssetImage('assets/images/img1.jpg'),
            fit: BoxFit.cover,
          ),
        )
      ],
    );
  }
}
