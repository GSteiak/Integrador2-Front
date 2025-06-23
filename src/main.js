// src/main.js

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Importações do PrimeVue
import PrimeVue from 'primevue/config';
import 'primevue/resources/themes/lara-light-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

// Novas importações para Confirmação e Toast
import ConfirmationService from 'primevue/confirmationservice'; // <-- Nova importação
import ToastService from 'primevue/toastservice';           // <-- Nova importação

const app = createApp(App)

app.use(router)
app.use(PrimeVue, { ripple: true }); // ripple: true adiciona um efeito visual de clique
app.use(ConfirmationService);         // <-- Use o serviço de confirmação
app.use(ToastService);                // <-- Use o serviço de Toast para notificações

app.mount('#app')