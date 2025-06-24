<template>
  <div style="padding: 20px">
    <div class="p-d-flex p-jc-between p-ai-center">
      <h1>Bem-vindo à Clínica de Agendamento!</h1>
      <Button label="Sair" icon="pi pi-sign-out" class="p-button-danger" @click="logout" />
    </div>

    <p>Utilize a navegação para gerenciar as informações de Médicos, Pacientes e Agendamentos.</p>

    <Card style="width: 25em; margin-top: 2em">
      <template #title> Gerenciamento </template>
      <template #content>
        <p>Navegue para as seções:</p>
        <ul>
          <li><router-link to="/medicos">Gerenciar Médicos</router-link></li>
          <li><router-link to="/pacientes">Gerenciar Pacientes</router-link></li>
          <li><router-link to="/agendamentos">Gerenciar Agendamentos</router-link></li>
          <li><router-link to="/relatorios">Gerar Relatórios</router-link></li>
        </ul>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router' // Importe useRouter para navegação
import Card from 'primevue/card' // Componente Card já está sendo usado
import Button from 'primevue/button' // <<< Importe o componente Button do PrimeVue

const router = useRouter() // Inicializa a instância do router

// NOVO MÉTODO DE LOGOUT
const logout = () => {
  // 1. Remove a flag de autenticação do localStorage
  localStorage.removeItem('isLoggedIn')

  // Opcional: Se você estiver armazenando outras informações do usuário, remova-as também
  // localStorage.removeItem('userId');
  // localStorage.removeItem('userProfile');

  // 2. Redireciona o usuário para a tela de login
  router.push({ name: 'Login' })
}
</script>

<style scoped>
ul {
  list-style-type: none;
  padding: 0;
}
li {
  margin-bottom: 10px;
}
a {
  text-decoration: none;
  color: #007bff; /* Cor de link padrão */
  font-weight: bold;
}
a:hover {
  text-decoration: underline;
}

/* Estilos adicionais para alinhar o título e o botão de sair */
.p-d-flex {
  display: flex !important;
}

.p-jc-between {
  justify-content: space-between !important;
}

.p-ai-center {
  align-items: center !important;
}
</style>
