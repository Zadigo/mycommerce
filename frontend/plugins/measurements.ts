import { formatMeasurement } from "~/utils/measurements"

export default defineNuxtPlugin(useNuxtApp => {
    return {
        provide: {
            formatMeasurement
        }
    }
})
