<template>
  <div class="p-d-flex p-jc-center p-ai-center" style="min-height: 100vh; padding: 20px;">
    <Card style="width: 80vw; max-width: 1000px;">
      <template #title>
        Relatórios de Agendamentos
      </template>
      <template #content>
        <Button label="Voltar ao Início" icon="pi pi-home" class="p-button-secondary p-mb-3" @click="goHome" />

        <div class="p-fluid p-formgrid p-grid p-mb-4">
            <div class="p-field p-col-12 p-md-4">
                <label for="dataInicio">Data Início</label>
                <Calendar id="dataInicio" v-model="filters.dataInicio" dateFormat="dd/mm/yy" showIcon />
            </div>
            <div class="p-field p-col-12 p-md-4">
                <label for="dataFim">Data Fim</label>
                <Calendar id="dataFim" v-model="filters.dataFim" dateFormat="dd/mm/yy" showIcon />
            </div>
            <div class="p-field p-col-12 p-md-4">
                <label for="medico">Médico (Opcional)</label>
                <Dropdown 
                    id="medico" 
                    v-model="filters.medicoId" 
                    :options="medicosOptions" 
                    optionLabel="nome" 
                    optionValue="id" 
                    placeholder="Selecione um médico" 
                    filter 
                    showClear />
            </div>
            <div class="p-col-12 p-text-right">
                <Button label="Gerar Relatório" icon="pi pi-file-excel" @click="generateReport" :disabled="!filters.dataInicio || !filters.dataFim" />
            </div>
        </div>

        <DataTable :value="agendamentosRelatorio" :paginator="true" :rows="10" responsiveLayout="scroll" v-if="agendamentosRelatorio.length > 0">
            <Column field="data" header="Data">
                <template #body="slotProps">
                    {{ formatarDataParaExibicao(slotProps.data.data) }}
                </template>
            </Column>
            <Column field="hora" header="Hora"></Column>
            <Column field="tipoConsulta" header="Tipo de Consulta"></Column>
            <Column field="medico.nome" header="Médico"></Column>
            <Column field="paciente.nome" header="Paciente"></Column>
            <Column field="paciente.cpf" header="CPF Paciente"></Column>
            <Column field="paciente.telefone" header="Telefone Paciente"></Column>
        </DataTable>
        <p v-else-if="reportGenerated" class="p-mt-4">Nenhum agendamento encontrado para os filtros selecionados.</p>

        <Toast />

      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Card from 'primevue/card';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Calendar from 'primevue/calendar';
import Dropdown from 'primevue/dropdown';

import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { useRouter } from 'vue-router'; 

const router = useRouter(); 
const toast = useToast();

const filters = ref({
    dataInicio: null,
    dataFim: null,
    medicoId: null 
});
const agendamentosRelatorio = ref([]);
const medicosOptions = ref([]);
const reportGenerated = ref(false);

const formatarDataParaExibicao = (dataISO) => {
    if (!dataISO) return '';
    const date = new Date(dataISO + 'T00:00:00'); 
    return date.toLocaleDateString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit' });
};

const formatarDataParaAPI = (date) => {
    if (!date) return null;
    return date.toISOString().split('T')[0];
};

const loadMedicosOptions = async () => {
    try {
        const response = await axios.get('http://localhost:8080/api/medicos');
        medicosOptions.value = response.data;
    } catch (error) {
        console.error('Erro ao carregar médicos para o filtro:', error);
        toast.add({severity:'error', summary: 'Erro', detail:'Falha ao carregar lista de médicos', life: 3000});
    }
};

const generateReport = async () => {
    reportGenerated.value = false; 

    if (!filters.value.dataInicio || !filters.value.dataFim) {
        toast.add({severity:'warn', summary: 'Atenção', detail:'Selecione a Data Início e a Data Fim.', life: 3000});
        return;
    }

    const dataInicioFormatted = formatarDataParaAPI(filters.value.dataInicio);
    const dataFimFormatted = formatarDataParaAPI(filters.value.dataFim);

    try {
        let url = `http://localhost:8080/api/agendamentos/relatorio?dataInicio=${dataInicioFormatted}&dataFim=${dataFimFormatted}`;
        
        if (filters.value.medicoId) {
            url += `&medicoId=${filters.value.medicoId}`;
        }

        const response = await axios.get(url);
        agendamentosRelatorio.value = response.data; 
        reportGenerated.value = true; 
        toast.add({severity:'success', summary: 'Sucesso', detail:'Relatório gerado com sucesso!', life: 3000});

    } catch (error) {
        console.error('Erro ao gerar relatório:', error);
        toast.add({severity:'error', summary: 'Erro', detail:'Falha ao gerar relatório de agendamentos.', life: 5000});
    }
};

const goHome = () => {
    router.push('/');
};

onMounted(() => {
  loadMedicosOptions(); 
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
.p-mb-3 { margin-bottom: 1rem; }
.p-mb-4 { margin-bottom: 1.5rem; }
.p-mt-4 { margin-top: 1.5rem; }
</style>