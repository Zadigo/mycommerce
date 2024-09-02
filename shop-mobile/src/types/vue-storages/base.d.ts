import { BaseStorage } from "@/plugins/vue-storages/base";
import { ProductCollections } from "../collections";

declare class ExtendedBaseStorage extends BaseStorage {
    retrieve(key: string): ProductCollections[];
}
