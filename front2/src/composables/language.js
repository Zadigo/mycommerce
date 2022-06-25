import i18n from "@/i18n";
import { onMounted } from "vue";

export default function useLanguage () {
    onMounted(() => {
        const doc = document.querySelector('html')
        doc.setAttribute('lang', i18n.global.locale)
    })

    function changeLanguage (value) {
        i18n.global.locale = value
    }

    return {
        changeLanguage
    }
}
