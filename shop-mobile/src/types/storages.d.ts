import { ProductCollections } from "./collections";

// https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation

declare module "@/plugins/vue-storages/base" {
    export interface BaseStorage {
      retrieve(key: string): ProductCollections[] | Product[] | number[];
    }
}
