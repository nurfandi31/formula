import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './assets/css/main.css'
import App from './App.vue'
import router from './router'
import PrimeVue from 'primevue/config'
import Aura from '@primeuix/themes/aura'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import Toast from 'primevue/toast'
import ToastService from 'primevue/toastservice'
import ProgressBar from 'primevue/progressbar'
import Chart from 'primevue/chart'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { 
  faPlus, faTrash, faEdit, faPrint, faCheck, faChartPie, 
  faCalendar, faFileAlt, faUsers, faCogs, faSignOutAlt, faDollarSign,
  faIndent, faOutdent, faBars
} from '@fortawesome/free-solid-svg-icons'

library.add(
  faPlus, faTrash, faEdit, faPrint, faCheck, faChartPie, 
  faCalendar, faFileAlt, faUsers, faCogs, faSignOutAlt, faDollarSign,
  faIndent, faOutdent, faBars
)

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.use(PrimeVue, {
  theme: {
    preset: Aura
  }
})
app.use(ToastService)

app.component('Button', Button)
app.component('DatePicker', DatePicker)
app.component('InputNumber', InputNumber)
app.component('Select', Select)
app.component('Toast', Toast)
app.component('ProgressBar', ProgressBar)
app.component('Chart', Chart)
app.component('font-awesome-icon', FontAwesomeIcon)

app.mount('#app')
