import { VueLocalStorageInstance, VueSessionInstance } from "../plugins/vue-storages";
import { Axios } from "axios";

import dayjs from "dayjs";

declare module "pinia" {
  declare interface PiniaCustomProperties {
    $session: VueSessionInstance;
    $localstorate: VueLocalStorageInstance;
  }
}

declare module "vue" {
  interface ComponentCustomProperties {
    $http: Axios;
    $httpQuart: Axios;
    $date: dayjs;
  }
}
