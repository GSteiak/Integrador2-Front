// src/router/index.js

import { createRouter, createWebHistory } from 'vue-router'
// Certifique-se de que HomeView é necessário ou remova se for substituído pelo LoginView
import HomeView from '../views/HomeView.vue'

// Importações dos componentes de View
import LoginView from '../views/LoginView.vue' // Sua nova tela de Login
import MedicosView from '../views/MedicosView.vue'
import PacientesView from '../views/PacientesView.vue'
import AgendamentosView from '../views/AgendamentosView.vue'
import RelatoriosView from '../views/RelatoriosView.vue'

const routes = [
  {
    path: '/',
    name: 'Login', // Renomeamos 'home' para 'Login' e definimos o componente LoginView
    component: LoginView,
  },
  {
    path: '/home', // Opcional: Se ainda quiser manter uma HomeView após o login, você pode movê-la aqui
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }, // Se HomeView precisar de login
  },
  {
    path: '/medicos',
    name: 'medicos',
    component: MedicosView,
    meta: { requiresAuth: true }, // Esta rota *exige* que o usuário esteja logado
  },
  {
    path: '/pacientes',
    name: 'pacientes',
    component: PacientesView,
    meta: { requiresAuth: true }, // Esta rota *exige* que o usuário esteja logado
  },
  {
    path: '/agendamentos',
    name: 'agendamentos',
    component: AgendamentosView,
    meta: { requiresAuth: true }, // Esta rota *exige* que o usuário esteja logado
  },
  {
    path: '/relatorios',
    name: 'relatorios',
    component: RelatoriosView,
    meta: { requiresAuth: true }, // Esta rota *exige* que o usuário esteja logado
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// ---

// Guarda de Rota: Este bloco verifica a autenticação antes de cada navegação
router.beforeEach((to, from, next) => {
  // Pega o status de login do localStorage.
  // O 'isLoggedIn' é a flag que você definirá em LoginView.vue após um login bem-sucedido.
  const isLoggedIn = localStorage.getItem('isLoggedIn')

  // CENÁRIO 1: O usuário tenta acessar uma rota que *exige* autenticação (qualquer rota com 'requiresAuth: true')
  // E ele *NÃO* está logado.
  if (to.meta.requiresAuth && !isLoggedIn) {
    // Redireciona para a tela de Login
    next({ name: 'Login' }) // Usa o nome da rota para redirecionar, que é 'Login'
  }
  // CENÁRIO 2: O usuário *JÁ* está logado
  // E tenta acessar a própria tela de Login ('/').
  else if (to.name === 'Login' && isLoggedIn) {
    // Redireciona ele para a tela principal da aplicação (Agendamentos é um bom padrão após login)
    next({ name: 'home' }) // Redireciona para a rota 'agendamentos'
  }
  // CENÁRIO 3: Todas as outras situações
  // (Ex: usuário logado acessando rota protegida,
  // usuário não logado acessando rota *não* protegida,
  // ou usuário logado saindo da rota de login para outra página).
  else {
    // Permite que a navegação continue para a rota desejada
    next()
  }
})

export default router
