import { VueLocalStorageInstance, VueSessionInstance } from "../plugins/vue-storages";
import { Axios } from "axios";

import dayjs from "dayjs";

declare module "pinia" {
  declare interface PiniaCustomProperties {
    $session: VueSessionInstance;
    $localstorage: VueLocalStorageInstance;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $http: Axios;
    $httpQuart: Axios;
    $date: dayjs;
    localStorageData: {
      likedProducts: number[];
      visitedProducts: number[];
    }
  }
}

declare module "@/plugins/vue-storages/local-storage" {
  interface SavedStorageData {
    likedProducts: number[];
    visitedProducts: number[];
  }
}
