import i18n from '@/i18n'
import { onMounted, watch, ref } from 'vue'

export default function useLanguage () {
    const language = ref(i18n.global.locale)
    
    onMounted(() => {
        changeLanguage(language.value)
    })
    
    watch(language, (current) => {
        changeLanguage(current)
    })

    function changeLanguage (value) {
        i18n.global.locale = value

        const doc = document.querySelector('html')
        doc.setAttribute('lang', language.value)
    }

    return {
        changeLanguage
    }
}
