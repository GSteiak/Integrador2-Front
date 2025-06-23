<template>
  <div style="padding: 20px;">
    <h1>Bem-vindo à Clínica de Agendamento!</h1>
    <p>Utilize a navegação para gerenciar as informações de Médicos, Pacientes e Agendamentos.</p>

    <Card style="width: 25em; margin-top: 2em;">
        <template #title>
            Gerenciamento
        </template>
        <template #content>
            <p>Navegue para as seções:</p>
            <ul>
                <li><router-link to="/medicos">Gerenciar Médicos</router-link></li>
                <li><router-link to="/pacientes">Gerenciar Pacientes</router-link></li>
                <li><router-link to="/agendamentos">Gerenciar Agendamentos</router-link></li>
                <li><router-link to="/relatorios">Gerar Relatórios</router-link></li> </ul>
        </template>
    </Card>
  </div>
</template>

<script setup>
// Importe o componente Card do PrimeVue
import Card from 'primevue/card';
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
</style>