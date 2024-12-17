import { boot } from 'quasar/wrappers'
import { VueSession } from '../plugins/vue-storages'


const session = new VueSession()

if (import.meta.env.DEV) {
  window.VueSession = session
}

export default boot(({ app }) => {
  session.setup(app)
  app.config.globalProperties.$session = session
})

export {
  session
}
