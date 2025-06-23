// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

// Importações dos seus componentes de View existentes
import MedicosView from '../views/MedicosView.vue'
import PacientesView from '../views/PacientesView.vue'
import AgendamentosView from '../views/AgendamentosView.vue'
import RelatoriosView from '../views/RelatoriosView.vue' // <-- Adicione esta linha

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/medicos',
      name: 'medicos',
      component: MedicosView
    },
    {
      path: '/pacientes',
      name: 'pacientes',
      component: PacientesView
    },
    {
      path: '/agendamentos',
      name: 'agendamentos',
      component: AgendamentosView
    },
    // --- Nova Rota para Relatórios ---
    {
      path: '/relatorios', // Este será o caminho na URL
      name: 'relatorios',  // Nome da rota (opcional, mas bom para navegação programática)
      component: RelatoriosView // Componente que será carregado
    }
  ]
})

export default router