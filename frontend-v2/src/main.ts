import { createApp } from 'vue'
import stores from './stores'
import router from './router'
import i18n from './i18n'
import axios from 'axios'
import { createVuestic } from 'vuestic-ui'
import vuesticGlobalConfig from './services/vuestic-ui/global-config'
import { createGtm } from '@gtm-support/vue-gtm'
import Datepicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import App from './App.vue'

const app = createApp(App)

axios.defaults.baseURL = 'http://localhost:3601'

app.use(stores)
app.use(router)
app.use(i18n)
app.use(createVuestic({ config: vuesticGlobalConfig }))

app.component('Datepicker', Datepicker);

if (import.meta.env.VITE_APP_GTM_ENABLED) {
  app.use(
    createGtm({
      id: import.meta.env.VITE_APP_GTM_KEY,
      debug: false,
      vueRouter: router,
    }),
  )
}

app.mount('#app')
