<template>
  <div class="p-d-flex p-jc-center p-ai-center" style="min-height: 100vh; padding: 20px;">
    <Card style="width: 80vw; max-width: 1000px;">
      <template #title>
        Gerenciar Pacientes
      </template>
      <template #content>
        <Button label="Voltar ao Início" icon="pi pi-home" class="p-button-secondary p-mb-3" @click="goHome" />
        <p>Lista de pacientes da sua API de backend:</p>

        <Button label="Adicionar Novo Paciente" icon="pi pi-plus" class="p-button-success" style="margin-top: 1em; margin-bottom: 2em;" @click="openNew" />

        <DataTable :value="pacientes" :paginator="true" :rows="10" responsiveLayout="scroll">
            <Column field="nome" header="Nome"></Column>
            <Column field="cpf" header="CPF"></Column>
            <Column field="dataNascimento" header="Nascimento">
                <template #body="slotProps">
                    {{ formatarDataParaExibicao(slotProps.data.dataNascimento) }}
                </template>
            </Column>
            <Column field="telefone" header="Telefone"></Column>
            <Column field="email" header="Email"></Column>
            <Column header="Ações">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editPaciente(slotProps.data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeletePaciente(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="pacienteDialog" :style="{width: '450px'}" header="Detalhes do Paciente" :modal="true" class="p-fluid">
            <div class="p-field">
                <label for="nome">Nome</label>
                <InputText id="nome" v-model.trim="paciente.nome" required="true" autofocus :class="{'p-invalid': submitted && !paciente.nome}" />
                <small class="p-invalid" v-if="submitted && !paciente.nome">Nome é obrigatório.</small>
            </div>
            <div class="p-field">
                <label for="cpf">CPF</label>
                <InputMask 
                    id="cpf" 
                    v-model.trim="paciente.cpf" 
                    mask="999.999.999-99" 
                    placeholder="___.___.___-__" 
                    required="true" 
                    :class="{'p-invalid': submitted && !paciente.cpf}" />
                <small class="p-invalid" v-if="submitted && !paciente.cpf">CPF é obrigatório.</small>
            </div>
            <div class="p-field">
                <label for="dataNascimento">Data de Nascimento</label>
                <Calendar 
                    id="dataNascimento" 
                    v-model="paciente.dataNascimento" 
                    dateFormat="dd/mm/yy" 
                    mask="99/99/9999" 
                    showIcon 
                    required="true" 
                    :class="{'p-invalid': submitted && !paciente.dataNascimento}" />
                <small class="p-invalid" v-if="submitted && !paciente.dataNascimento">Data de Nascimento é obrigatória.</small>
            </div>
            <div class="p-field">
                <label for="telefone">Telefone</label>
                <InputText id="telefone" v-model.trim="paciente.telefone" :class="{'p-invalid': submitted && !paciente.telefone}" />
                <small class="p-invalid" v-if="submitted && !paciente.telefone">Telefone é obrigatório.</small>
            </div>
            <div class="p-field">
                <label for="email">Email</label>
                <InputText id="email" v-model.trim="paciente.email" :class="{'p-invalid': submitted && !paciente.email}" />
                <small class="p-invalid" v-if="submitted && !paciente.email">Email é obrigatório.</small>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
                <Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="savePaciente" />
            </template>
        </Dialog>

        <ConfirmDialog></ConfirmDialog>
        <Toast />

      </template>
    </Card>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';
import InputMask from 'primevue/inputmask'; // <-- NOVA IMPORTAÇÃO: InputMask

import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

// Variáveis reativas
const router = useRouter();
const pacientes = ref([]);
const pacienteDialog = ref(false);
const paciente = ref({});
const submitted = ref(false);

// Inicializa os serviços de confirmação e toast
const confirm = useConfirm();
const toast = useToast();

// Função para formatar a data para exibição (DD/MM/AAAA)
const formatarDataParaExibicao = (dataISO) => {
    if (!dataISO) return '';
    const date = new Date(dataISO + 'T00:00:00'); 
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

// Função para carregar os pacientes da API
const loadPacientes = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/pacientes');
    pacientes.value = response.data;
    console.log('Pacientes carregados da API:', response.data);
  } catch (error) {
    console.error('Erro ao carregar pacientes:', error);
    toast.add({severity:'error', summary: 'Erro', detail:'Falha ao carregar pacientes', life: 3000});
  }
};

// Abre o modal para um novo paciente
const openNew = () => {
    paciente.value = {};
    submitted.value = false;
    pacienteDialog.value = true;
};

// Esconde o modal
const hideDialog = () => {
    pacienteDialog.value = false;
    submitted.value = false;
};

// Salva ou atualiza um paciente
const savePaciente = async () => {
    submitted.value = true;

    if (paciente.value.nome && paciente.value.cpf && paciente.value.dataNascimento && paciente.value.telefone && paciente.value.email) {
        try {
            const dataParaAPI = paciente.value.dataNascimento instanceof Date
                ? paciente.value.dataNascimento.toISOString().split('T')[0]
                : paciente.value.dataNascimento;

            // Remove a máscara do CPF antes de enviar para o backend
            // A API espera o CPF como string de 11 dígitos, sem pontos ou traço
            const cpfSemMascara = paciente.value.cpf ? paciente.value.cpf.replace(/\D/g, '') : ''; 

            const pacienteParaSalvar = { 
                ...paciente.value, 
                dataNascimento: dataParaAPI,
                cpf: cpfSemMascara // Usa o CPF sem máscara para enviar à API
            };

            if (paciente.value.id) {
                const response = await axios.put(`http://localhost:8080/api/pacientes/${paciente.value.id}`, pacienteParaSalvar);
                console.log('Paciente atualizado:', response.data);
                toast.add({severity:'success', summary: 'Sucesso', detail:'Paciente atualizado', life: 3000});
            } else {
                const response = await axios.post('http://localhost:8080/api/pacientes', pacienteParaSalvar);
                console.log('Paciente criado:', response.data);
                toast.add({severity:'success', summary: 'Sucesso', detail:'Paciente criado', life: 3000});
            }

            await loadPacientes();
            hideDialog();

        } catch (error) {
            console.error('Erro ao salvar paciente:', error);
            toast.add({severity:'error', summary: 'Erro', detail:'Falha ao salvar paciente', life: 3000});
        }
    }
};

const goHome = () => {
    router.push('/');
};

// Função para editar paciente: preenche o formulário e abre o modal
const editPaciente = (pacienteData) => {
    const dataNascimento = pacienteData.dataNascimento 
        ? new Date(pacienteData.dataNascimento + 'T00:00:00')
        : null;

    // No caso de edição, o CPF vem sem máscara do backend, 
    // mas o InputMask espera um valor formatado ou sem formatação.
    // O v-model do InputMask lida bem com a string de 11 dígitos.
    paciente.value = {...pacienteData, dataNascimento: dataNascimento}; 
    pacienteDialog.value = true;
};

const confirmDeletePaciente = (pacienteData) => {
    confirm.require({
        message: `Tem certeza que deseja excluir o paciente ${pacienteData.nome}?`,
        header: 'Confirmação de Exclusão',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            try {
                await axios.delete(`http://localhost:8080/api/pacientes/${pacienteData.id}`);
                toast.add({severity:'success', summary: 'Sucesso', detail:'Paciente excluído', life: 3000});
                await loadPacientes();
            } catch (error) {
                console.error('Erro ao excluir paciente:', error);
                toast.add({severity:'error', summary: 'Erro', detail:'Falha ao excluir paciente', life: 3000});
            }
        },
        reject: () => {
            toast.add({severity:'info', summary:'Cancelado', detail:'Exclusão cancelada', life: 3000});
        }
    });
};

onMounted(() => {
  loadPacientes();
});
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
.p-calendar, .p-inputmask {
    width: 100%; /* Garante que o Calendar e InputMask ocupem a largura total no modal */
}
</style>