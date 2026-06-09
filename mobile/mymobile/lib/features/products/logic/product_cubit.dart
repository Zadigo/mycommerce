import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:mymobile/features/products/logic/products_model.dart';


class ProductsCubit extends Cubit<List<ProductModel>> {
  ProductsCubit() : super([]);

  void addProduct(ProductModel product) {
    emit([...state, product]);
  }
}
  