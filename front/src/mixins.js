export default {
    methods: {
        getVerticalScrollPercentage(el) {
            // Get the percentage of the current
            // page that was scrolled by the user
            var parent = el.parentNode
            return (el.scrollTop || parent.scrollTop) / (parent.scrollHeight - parent.clientHeight) * 100
        }
    }
}
