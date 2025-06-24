<template>
  <div class="login-container">
    <h2>Acesso ao Sistema</h2>
    <form @submit.prevent="handleLogin">
      <div class="form-group">
        <label for="username">Usuário:</label>
        <input type="text" id="username" v-model="username" required autocomplete="username" />
      </div>
      <div class="form-group">
        <label for="password">Senha:</label>
        <input
          type="password"
          id="password"
          v-model="password"
          required
          autocomplete="current-password"
        />
      </div>
      <button type="submit">Entrar</button>
      <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
    </form>
  </div>
</template>

<script>
import axios from 'axios' // Certifique-se de que Axios está instalado (npm install axios)

export default {
  name: 'LoginView',
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
    }
  },
  methods: {
    async handleLogin() {
      this.errorMessage = '' // Limpa mensagens de erro anteriores
      try {
        // ATENÇÃO: Use a URL correta do seu backend Spring Boot!
        // Durante o desenvolvimento local, será algo como 'http://localhost:8080'
        // Quando publicado, será a URL da sua API no Render/Railway.
        // No seu LoginView.vue, dentro de handleLogin()
        const backendUrl = 'http://localhost:8080'
        const response = await axios.post(`${backendUrl}/api/usuarios/login`, {
          // <<<<<<<<< AQUI A MUDANÇA
          username: this.username,
          password: this.password,
        })

        // Se o backend retornar sucesso (ex: status 200 OK)
        if (response.status === 200) {
          // Marca o usuário como logado (simplesmente no localStorage para este projeto)
          localStorage.setItem('isLoggedIn', 'true')
          // Redireciona para a tela principal (home)
          this.$router.push('/home')
        }
        // Você pode adicionar mais lógica aqui se o backend retornar outros códigos de sucesso/erro
      } catch (error) {
        console.error('Erro de login:', error)
        // Lidar com erros de requisição (ex: 401 Unauthorized do backend)
        if (error.response && error.response.status === 401) {
          this.errorMessage = 'Usuário ou senha inválidos. Tente novamente.'
        } else {
          // Para outros erros (rede, servidor)
          this.errorMessage = 'Ocorreu um erro inesperado. Por favor, tente mais tarde.'
        }
      }
    },
  },
}
</script>

<style scoped>
/* Estilos básicos para a tela de login (você pode ajustar) */
.login-container {
  max-width: 400px;
  margin: 80px auto;
  padding: 30px;
  border: 1px solid #e0e0e0;
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  background-color: #ffffff;
  text-align: center;
}

h2 {
  color: #333;
  margin-bottom: 25px;
  font-size: 1.8em;
}

.form-group {
  margin-bottom: 20px;
  text-align: left;
}

label {
  display: block;
  margin-bottom: 8px;
  font-weight: bold;
  color: #555;
}

input[type='text'],
input[type='password'] {
  width: calc(100% - 22px); /* Considerando padding e borda */
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1em;
  box-sizing: border-box; /* Garante que padding não adicione à largura */
}

input:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
  outline: none;
}

button {
  background-color: #007bff;
  color: white;
  padding: 12px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1em;
  width: 100%;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #0056b3;
}

.error-message {
  color: #dc3545;
  margin-top: 15px;
  font-size: 0.95em;
}
</style>
