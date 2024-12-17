// import { Ref } from "vue";
// import { ProductCollections } from "./collections";
// import { VueLocalStorage } from "@/plugins/vue-storages";

// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation

// declare module "@/plugins/vue-storages/base" {
//   export interface BaseStorage {
//     retrieve(key: string): ProductCollections[] | Product[] | number[];
//   }
// }

// type LocalStorageData = {
//   gridDisplay: 1 | 2 | 3;
// };

// declare module "@/plugins/vue-storages/local-storage" {
//   export function useVueLocalStorage(): {
//     data: Ref<LocalStorageData>;
//     instance: VueLocalStorage
//   };
// }
