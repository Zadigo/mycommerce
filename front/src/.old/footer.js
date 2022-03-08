import Vue from "vue"

function loadFooterData () {
    var footer = require.context('./', true, /footer\.json$/i)
    console.log(console.log(footer))
}

var footerPlugin = {
    install: (Vue) => {
        Vue.mixin({
            data: () => ({
                footer: loadFooterData()
            })
        })
    }
}

Vue.use(footerPlugin)
