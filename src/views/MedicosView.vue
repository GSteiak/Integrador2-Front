<template>
  <div class="p-d-flex p-jc-center p-ai-center" style="min-height: 100vh; padding: 20px">
    <Card style="width: 80vw; max-width: 1000px">
      <template #title> Gerenciar Médicos </template>
      <template #content>
        <Button
          label="Voltar ao Início"
          icon="pi pi-home"
          class="p-button-secondary p-mb-3"
          @click="goHome"
        />

        <p>Lista de médicos da sua API de backend:</p>

        <Button
          label="Adicionar Novo Médico"
          icon="pi pi-plus"
          class="p-button-success"
          style="margin-top: 1em; margin-bottom: 2em"
          @click="openNew"
        />

        <DataTable :value="medicos" :paginator="true" :rows="10" responsiveLayout="scroll">
          <Column field="nome" header="Nome"></Column>
          <Column field="especialidade" header="Especialidade"></Column>
          <Column field="crm" header="CRM"></Column>
          <Column header="Ações">
            <template #body="slotProps">
              <Button
                icon="pi pi-pencil"
                class="p-button-rounded p-button-success p-mr-2"
                @click="editMedico(slotProps.data)"
              />
              <Button
                icon="pi pi-trash"
                class="p-button-rounded p-button-warning"
                @click="confirmDeleteMedico(slotProps.data)"
              />
            </template>
          </Column>
        </DataTable>

        <Dialog
          v-model:visible="medicoDialog"
          :style="{ width: '450px' }"
          header="Detalhes do Médico"
          :modal="true"
          class="p-fluid"
        >
          <div class="p-field">
            <label for="nome">Nome</label>
            <InputText
              id="nome"
              v-model.trim="medico.nome"
              required="true"
              autofocus
              :class="{ 'p-invalid': submitted && !medico.nome }"
            />
            <small class="p-invalid" v-if="submitted && !medico.nome">Nome é obrigatório.</small>
          </div>
          <div class="p-field">
            <label for="especialidade">Especialidade</label>
            <InputText
              id="especialidade"
              v-model.trim="medico.especialidade"
              required="true"
              :class="{ 'p-invalid': submitted && !medico.especialidade }"
            />
            <small class="p-invalid" v-if="submitted && !medico.especialidade"
              >Especialidade é obrigatória.</small
            >
          </div>
          <div class="p-field">
            <label for="crm">CRM</label>
            <InputText
              id="crm"
              v-model.trim="medico.crm"
              required="true"
              :class="{ 'p-invalid': submitted && !medico.crm }"
            />
            <small class="p-invalid" v-if="submitted && !medico.crm">CRM é obrigatório.</small>
          </div>

          <template #footer>
            <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog" />
            <Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="saveMedico" />
          </template>
        </Dialog>

        <ConfirmDialog></ConfirmDialog> <Toast />
      </template>
    </Card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import axios from 'axios'
import Card from 'primevue/card'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dialog from 'primevue/dialog'
import InputText from 'primevue/inputtext'

// Importações para Deleção e Notificação
import ConfirmDialog from 'primevue/confirmdialog' // <-- Nova importação
import { useConfirm } from 'primevue/useconfirm' // <-- Nova importação
import Toast from 'primevue/toast' // <-- Nova importação
import { useToast } from 'primevue/usetoast' // <-- Nova importação

const router = useRouter()
const medicos = ref([])
const medicoDialog = ref(false)
const medico = ref({})
const submitted = ref(false)

// Inicializa os serviços de confirmação e toast
const confirm = useConfirm()
const toast = useToast()

const loadMedicos = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/medicos')
    medicos.value = response.data
    console.log('Médicos carregados da API:', response.data)
  } catch (error) {
    console.error('Erro ao carregar médicos:', error)
    toast.add({
      severity: 'error',
      summary: 'Erro',
      detail: 'Falha ao carregar médicos',
      life: 3000,
    })
  }
}

const openNew = () => {
  medico.value = {}
  submitted.value = false
  medicoDialog.value = true
}

const hideDialog = () => {
  medicoDialog.value = false
  submitted.value = false
}

const saveMedico = async () => {
  submitted.value = true

  if (medico.value.nome && medico.value.especialidade && medico.value.crm) {
    try {
      if (medico.value.id) {
        const response = await axios.put(
          `http://localhost:8080/api/medicos/${medico.value.id}`,
          medico.value,
        )
        console.log('Médico atualizado:', response.data)
        toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Médico atualizado',
          life: 3000,
        })
      } else {
        const response = await axios.post('http://localhost:8080/api/medicos', medico.value)
        console.log('Médico criado:', response.data)
        toast.add({ severity: 'success', summary: 'Sucesso', detail: 'Médico criado', life: 3000 })
      }

      await loadMedicos()
      hideDialog()
    } catch (error) {
      console.error('Erro ao salvar médico:', error)
      toast.add({
        severity: 'error',
        summary: 'Erro',
        detail: 'Falha ao salvar médico',
        life: 3000,
      })
    }
  }
}

const editMedico = (medicoData) => {
  medico.value = { ...medicoData }
  medicoDialog.value = true
}

const goHome = () => {
  router.push({ name: 'home' })
}

// Função para confirmar a deleção
const confirmDeleteMedico = (medicoData) => {
  confirm.require({
    message: `Tem certeza que deseja excluir o médico ${medicoData.nome}?`,
    header: 'Confirmação de Exclusão',
    icon: 'pi pi-exclamation-triangle',
    accept: async () => {
      // Lógica de deleção (DELETE)
      try {
        await axios.delete(`http://localhost:8080/api/medicos/${medicoData.id}`)
        toast.add({
          severity: 'success',
          summary: 'Sucesso',
          detail: 'Médico excluído',
          life: 3000,
        })
        await loadMedicos() // Recarrega a lista
      } catch (error) {
        console.error('Erro ao excluir médico:', error)
        toast.add({
          severity: 'error',
          summary: 'Erro',
          detail: 'Falha ao excluir médico',
          life: 3000,
        })
      }
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Cancelado',
        detail: 'Exclusão cancelada',
        life: 3000,
      })
    },
  })
}

onMounted(() => {
  loadMedicos()
})
</script>

<style scoped>
.p-field {
  margin-bottom: 1rem;
}
.p-field label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}
.p-button.p-button-rounded {
  width: 2.357rem;
  height: 2.357rem;
  padding: 0;
}
.p-mr-2 {
  margin-right: 0.5rem;
}
</style>
