<template>
  <div class="p-d-flex p-jc-center p-ai-center" style="min-height: 100vh; padding: 20px;">
    <Card style="width: 80vw; max-width: 1000px;">
      <template #title>
        Gerenciar Agendamentos
      </template>
      <template #content>
        <Button label="Voltar ao Início" icon="pi pi-home" class="p-button-secondary p-mb-3" @click="goHome" />
        <p>Lista de agendamentos da sua API de backend:</p>

        <Button label="Adicionar Novo Agendamento" icon="pi pi-plus" class="p-button-success" style="margin-top: 1em; margin-bottom: 2em;" @click="openNew" />

        <DataTable :value="agendamentos" :paginator="true" :rows="10" responsiveLayout="scroll">
            <Column field="data" header="Data">
                <template #body="slotProps">
                    {{ formatarDataParaExibicao(slotProps.data.data) }}
                </template>
            </Column>
            <Column field="hora" header="Hora"></Column>
            <Column field="tipoConsulta" header="Tipo de Consulta"></Column>
            <Column field="medico.nome" header="Médico"></Column>
            <Column field="paciente.nome" header="Paciente"></Column>
            <Column header="Ações">
                <template #body="slotProps">
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-success p-mr-2" @click="editAgendamento(slotProps.data)" />
                    <Button icon="pi pi-trash" class="p-button-rounded p-button-warning" @click="confirmDeleteAgendamento(slotProps.data)" />
                </template>
            </Column>
        </DataTable>

        <Dialog v-model:visible="agendamentoDialog" :style="{width: '450px'}" header="Detalhes do Agendamento" :modal="true" class="p-fluid">
            <div class="p-field">
                <label for="data">Data</label>
                <Calendar 
                    id="data" 
                    v-model="agendamento.data" 
                    dateFormat="dd/mm/yy" 
                    mask="99/99/9999" 
                    showIcon 
                    required="true" 
                    :class="{'p-invalid': submitted && !agendamento.data}" />
                <small class="p-invalid" v-if="submitted && !agendamento.data">Data é obrigatória.</small>
            </div>
            <div class="p-field">
                <label for="hora">Hora</label>
                <Calendar 
                    id="hora" 
                    v-model="agendamento.hora" 
                    timeOnly 
                    hourFormat="24" 
                    mask="99:99"
                    required="true" 
                    :class="{'p-invalid': submitted && !agendamento.hora}" />
                <small class="p-invalid" v-if="submitted && !agendamento.hora">Hora é obrigatória.</small>
            </div>
            <div class="p-field">
                <label for="tipoConsulta">Tipo de Consulta</label>
                <InputText id="tipoConsulta" v-model.trim="agendamento.tipoConsulta" required="true" :class="{'p-invalid': submitted && !agendamento.tipoConsulta}" />
                <small class="p-invalid" v-if="submitted && !agendamento.tipoConsulta">Tipo de Consulta é obrigatório.</small>
            </div>

            <div class="p-field">
                <label for="medico">Médico</label>
                <Dropdown 
                    id="medico" 
                    v-model="agendamento.medico" 
                    :options="medicosOptions" 
                    optionLabel="nome" 
                    placeholder="Selecione um médico" 
                    filter 
                    required="true" 
                    :class="{'p-invalid': submitted && !agendamento.medico}" />
                <small class="p-invalid" v-if="submitted && !agendamento.medico">Médico é obrigatório.</small>
            </div>

            <div class="p-field">
                <label for="paciente">Paciente</label>
                <Dropdown 
                    id="paciente" 
                    v-model="agendamento.paciente" 
                    :options="pacientesOptions" 
                    optionLabel="nome" 
                    placeholder="Selecione um paciente" 
                    filter 
                    required="true" 
                    :class="{'p-invalid': submitted && !agendamento.paciente}" />
                <small class="p-invalid" v-if="submitted && !agendamento.paciente">Paciente é obrigatório.</small>
            </div>

            <template #footer>
                <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="hideDialog"/>
                <Button label="Salvar" icon="pi pi-check" class="p-button-text" @click="saveAgendamento" />
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
import Dropdown from 'primevue/dropdown'; // <-- Nova importação para Dropdown

import ConfirmDialog from 'primevue/confirmdialog';
import { useConfirm } from "primevue/useconfirm";
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';

// Variáveis reativas
const router = useRouter();
const agendamentos = ref([]);
const medicosOptions = ref([]);   // Lista de médicos para o dropdown
const pacientesOptions = ref([]); // Lista de pacientes para o dropdown
const agendamentoDialog = ref(false);
const agendamento = ref({});
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

// Função para carregar os agendamentos da API
const loadAgendamentos = async () => {
  try {
    const response = await axios.get('http://localhost:8080/api/agendamentos');
    agendamentos.value = response.data;
    console.log('Agendamentos carregados da API:', response.data);
  } catch (error) {
    console.error('Erro ao carregar agendamentos:', error);
    toast.add({severity:'error', summary: 'Erro', detail:'Falha ao carregar agendamentos', life: 3000});
  }
};

const goHome = () => {
    router.push('/');
};

// Funções para carregar médicos e pacientes para os Dropdowns
const loadMedicosAndPacientes = async () => {
    try {
        const [medicosRes, pacientesRes] = await Promise.all([
            axios.get('http://localhost:8080/api/medicos'),
            axios.get('http://localhost:8080/api/pacientes')
        ]);
        medicosOptions.value = medicosRes.data;
        pacientesOptions.value = pacientesRes.data;
        console.log('Médicos para dropdown:', medicosOptions.value);
        console.log('Pacientes para dropdown:', pacientesOptions.value);
    } catch (error) {
        console.error('Erro ao carregar médicos/pacientes para dropdowns:', error);
        toast.add({severity:'error', summary: 'Erro', detail:'Falha ao carregar listas de médicos e pacientes', life: 3000});
    }
};


// Abre o modal para um novo agendamento
const openNew = () => {
    agendamento.value = {}; // Limpa o objeto do agendamento
    submitted.value = false;
    agendamentoDialog.value = true;
    loadMedicosAndPacientes(); // Carrega as listas para os dropdowns ao abrir o modal
};

// Esconde o modal
const hideDialog = () => {
    agendamentoDialog.value = false;
    submitted.value = false;
};

// Salva ou atualiza um agendamento
const saveAgendamento = async () => {
    submitted.value = true;

    if (agendamento.value.data && agendamento.value.hora && agendamento.value.tipoConsulta && agendamento.value.medico && agendamento.value.paciente) {
        try {
            // Formata a data para AAAA-MM-DD
            const dataParaAPI = agendamento.value.data instanceof Date
                ? agendamento.value.data.toISOString().split('T')[0]
                : agendamento.value.data;

            // Formata a hora para HH:MM (ex: 14:30)
            // O Calendar com timeOnly retorna um objeto Date.
            const horaParaAPI = agendamento.value.hora instanceof Date
                ? agendamento.value.hora.toTimeString().split(' ')[0].substring(0, 5) // Pega HH:MM
                : agendamento.value.hora; // Se já for string (em caso de edição sem alteração)

            // Cria o objeto a ser enviado, usando apenas os IDs de medico e paciente
            const agendamentoParaSalvar = { 
                ...agendamento.value, 
                data: dataParaAPI,
                hora: horaParaAPI,
                // Envia apenas o ID do médico e paciente, conforme esperado pela API
                medico: { id: agendamento.value.medico.id }, 
                paciente: { id: agendamento.value.paciente.id }
            };

            if (agendamento.value.id) {
                // Lógica para EDIÇÃO (PUT)
                const response = await axios.put(`http://localhost:8080/api/agendamentos/${agendamento.value.id}`, agendamentoParaSalvar);
                console.log('Agendamento atualizado:', response.data);
                toast.add({severity:'success', summary: 'Sucesso', detail:'Agendamento atualizado', life: 3000});
            } else {
                // Lógica para CRIAÇÃO (POST)
                const response = await axios.post('http://localhost:8080/api/agendamentos', agendamentoParaSalvar);
                console.log('Agendamento criado:', response.data);
                toast.add({severity:'success', summary: 'Sucesso', detail:'Agendamento criado', life: 3000});
            }

            await loadAgendamentos(); // Recarrega a lista
            hideDialog(); // Fecha o modal

        } catch (error) {
            console.error('Erro ao salvar agendamento:', error);
            toast.add({severity:'error', summary: 'Erro', detail:'Falha ao salvar agendamento', life: 3000});
        }
    }
};

// Função para editar agendamento: preenche o formulário e abre o modal
const editAgendamento = (agendamentoData) => {
    // Carrega as opções de médico e paciente antes de preencher o formulário
    loadMedicosAndPacientes().then(() => {
        // Converte a string de data para objeto Date para o Calendar
        const dataAgendamento = agendamentoData.data 
            ? new Date(agendamentoData.data + 'T00:00:00')
            : null;

        // Converte a string de hora para objeto Date para o Calendar (timeOnly)
        // É uma solução comum para o Calendar 'timeOnly' lidar com strings de hora
        const horaAgendamento = agendamentoData.hora 
            ? new Date(`2000-01-01T${agendamentoData.hora}:00`) // Data arbitrária para criar o objeto Date
            : null;

        agendamento.value = {
            ...agendamentoData, 
            data: dataAgendamento,
            hora: horaAgendamento,
            // O v-model do Dropdown espera o objeto completo do médico/paciente
            // Precisamos encontrar os objetos correspondentes nas listas options
            medico: medicosOptions.value.find(m => m.id === agendamentoData.medico.id),
            paciente: pacientesOptions.value.find(p => p.id === agendamentoData.paciente.id)
        };
        agendamentoDialog.value = true;
    });
};

// Função para confirmar a deleção
const confirmDeleteAgendamento = (agendamentoData) => {
    confirm.require({
        message: `Tem certeza que deseja excluir o agendamento de ${agendamentoData.paciente.nome} com ${agendamentoData.medico.nome} em ${formatarDataParaExibicao(agendamentoData.data)} as ${agendamentoData.hora}?`,
        header: 'Confirmação de Exclusão',
        icon: 'pi pi-exclamation-triangle',
        accept: async () => {
            try {
                await axios.delete(`http://localhost:8080/api/agendamentos/${agendamentoData.id}`);
                toast.add({severity:'success', summary: 'Sucesso', detail:'Agendamento excluído', life: 3000});
                await loadAgendamentos();
            } catch (error) {
                console.error('Erro ao excluir agendamento:', error);
                toast.add({severity:'error', summary: 'Erro', detail:'Falha ao excluir agendamento', life: 3000});
            }
        },
        reject: () => {
            toast.add({severity:'info', summary:'Cancelado', detail:'Exclusão cancelada', life: 3000});
        }
    });
};

// Carregar agendamentos ao montar o componente
onMounted(() => {
  loadAgendamentos();
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
.p-calendar, .p-dropdown, .p-inputtext {
    width: 100%;
}
</style>