import Vue from 'vue'

// import BootstrapVue from 'bootstrap-vue'
// import 'bootstrap-vue/dist/bootstrap-vue.css'
// import 'bootstrap/dist/css/bootstrap.min.css'

// Vue.use(BootstrapVue)
function getElement(id) {
    return document.querySelector(id)
}

var bootstrap = {
    install: (Vue) => {
        Vue.prototype.$bModal = {
            open: (id) => {
                var modal = getElement(`#${id}`)
                
                if (modal) {
                    modal.classList.add('show')
                    modal.style.display = 'block'

                    var roleAttr = document.createAttribute('role')

                    roleAttr.value = 'dialog'
                    modal.attributes.setNamedItem(roleAttr)
                }
            },
            
            close: (id) => {
                var modal = getElement(`#${id}`)

                if (modal) {
                    modal.classList.remove('show')
                    modal.style.display = 'none'

                    var ariaAttr = document.createAttribute('aria-hidden')

                    modal.attributes.removeNamedItem('role')
                    ariaAttr.value = true
                }
            }
        }

        Vue.directive('b-modal', {
            inserted: (el, binding) => {
                var modalId = Object.keys(binding.modifiers)[0]
                var modal = getElement(`#${modalId}`)

                el.addEventListener('click', (e) => {
                    console.log(e)
                }, { passive: false })

                console.log(el, binding, modal)
            }
        })
    }
}

Vue.use(bootstrap)
