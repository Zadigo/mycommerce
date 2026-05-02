import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mymobile/pages/account/account_index_page.dart';
import 'package:mymobile/pages/home_page.dart';

void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  final Map<String, WidgetBuilder> routes = {
    '/': (context) => const HomePage(),
    '/account': (context) => const AccountIndexPage(),
  };

  @override
  Widget build(BuildContext context) {
    const String title = 'Ecommerce Application';
    final ColorScheme colorScheme = ColorScheme.fromSeed(seedColor: Colors.deepPurple);
    return MaterialApp(
      title: title,
      theme: ThemeData(
        colorScheme: colorScheme,
        useMaterial3: true,
        fontFamily: GoogleFonts.manrope().fontFamily,
      ),
      routes: routes,
    );
  }
}
