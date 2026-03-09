<template>
    <Modal 
        :show="true"
        :title="'Редактирование сотрудника'" 
        @update:show="close"
    >
        <div class="baseVert">
            <div class="baseGoriz">
                <label>Фамилия <span class="required">*</span></label>
                <Input v-model="editData.first_name" type="text" placeholder="Иванов" />
            </div>
            
            <div class="baseGoriz">
                <label>Имя <span class="required">*</span></label>
                <Input v-model="editData.name" type="text" placeholder="Иван" />
            </div>
            
            <div class="baseGoriz">
                <label>Отчество</label>
                <Input v-model="editData.patronymic" type="text" placeholder="Иванович" />
            </div>
            
            <div class="baseGoriz">
                <label>Дата рождения <span class="required">*</span></label>
                <Input v-model="editData.date_of_birth" type="date" :max="today" />
            </div>
        </div>

        <template #footer>
            <Button @click="close" variant="secondary">Отмена</Button>
            <Button @click="saveChanges" variant="primary" :loading="isSaving">
                {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
            </Button>
        </template>
    </Modal>
</template>

<script>
import { ref, watch } from 'vue'; 
import {
    Button,
    Input,
    Modal
} from '@/components/index';

export default {
    name: 'EmployeeEditModal',
    components: {
        Button,
        Input,
        Modal
    },
    props: {
        data: {
            type: Object,
            default: null
        }
    },
    emits: ['close', 'update'], 
    setup(props, { emit }) {
        const editData = ref({});
        const isSaving = ref(false);
        const today = new Date().toISOString().split('T')[0];

        watch(() => props.data, (newData) => {
            if (newData) {
                editData.value = JSON.parse(JSON.stringify(newData));
            }
        }, { 
            immediate: true,
            deep: true
        });

        const close = () => {
            emit('close');
        };

        const saveChanges = async () => {
            isSaving.value = true;
            try {
                await emit('update', editData.value);
                close();
            } catch (error) {
                console.error('Ошибка при сохранении:', error);
            } finally {
                isSaving.value = false;
            }
        };

        return {
            editData,
            isSaving,
            today,
            close,
            saveChanges
        };
    }
};
</script>
<style scoped>
.required{
 color:red;
}
</style>