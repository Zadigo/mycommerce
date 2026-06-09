import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:mymobile/features/account/screens/account_index_screen.dart';
import 'package:mymobile/features/home/screens/home_screen.dart';
import 'package:mymobile/features/products/logic/product_cubit.dart';
import 'package:mymobile/core/widgets/base_navigation_widget.dart';


void main() {
  runApp(const MainApp());
}

class MainApp extends StatelessWidget {
  const MainApp({super.key});

  // void _handleNavigationBarTap(int index) {
  //   // Handle navigation bar tap if needed
  //   print('Tapped on index: $index');
  // }

  @override
  Widget build(BuildContext context) {
    const String title = 'Ecommerce Application';
    
    final ColorScheme colorScheme = ColorScheme.fromSeed(seedColor: Colors.purple);
    // final routing = ApplicationRouting();

    return MaterialApp(
      title: title,
      theme: ThemeData(
        colorScheme: colorScheme,
        useMaterial3: true,
        fontFamily: GoogleFonts.manrope().fontFamily,
      ),
      routes: {
        // '/': (context) => const HomeScreen(),
        '/account': (context) => const AccountIndexScreen(),
      },
      initialRoute: '/',
      home: MultiBlocProvider(
        providers: [
          BlocProvider<ProductsCubit>(
            create: (context) => ProductsCubit(),
          ),
        ],
        child: Scaffold(
          body: const HomeScreen(),
          bottomNavigationBar: const BaseNavigationWidget(
            // routing: routing,
            // onTap: _handleNavigationBarTap,
          ),
        ), 
      )
    );
  }
}
