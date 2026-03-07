<template>
    <Modal :show="modelValue" :title="'Паспортные данные'" @close="close">
        <div class="modal-header-actions">
            <Button @click="editMode = !editMode" size="small">
                {{ editMode ? 'Отмена' : 'Изменить' }}
            </Button>
        </div>

        <!-- Режим просмотра -->
        <div v-if="!editMode && data" class="view-mode">
            <div class="data-row">
                <span class="label">Серия:</span>
                <span class="value">{{ data.series || '-' }}</span>
            </div>
            <div class="data-row">
                <span class="label">Номер:</span>
                <span class="value">{{ data.number || '-' }}</span>
            </div>
            <div class="data-row">
                <span class="label">Дата выдачи:</span>
                <span class="value">{{ formatDate(data.date_of_issue) }}</span>
            </div>
            <div class="data-row">
                <span class="label">Код подразделения:</span>
                <span class="value">{{ data.unit_code || '-' }}</span>
            </div>
            <div class="data-row">
                <span class="label">Кем выдан:</span>
                <span class="value">{{ data.issued_by_whom || '-' }}</span>
            </div>
        </div>

        <!-- Режим редактирования -->
        <div v-if="editMode && data" class="edit-mode">
            <div class="form-group">
                <label>Серия паспорта <span class="required">*</span></label>
                <Input 
                    v-model="editData.series" 
                    type="text" 
                    maxlength="4" 
                    @input="formatSeries" 
                    placeholder="1234"
                />
            </div>
            <div class="form-group">
                <label>Номер паспорта <span class="required">*</span></label>
                <Input 
                    v-model="editData.number" 
                    type="text" 
                    maxlength="6" 
                    @input="formatNumber" 
                    placeholder="123456"
                />
            </div>
            <div class="form-group">
                <label>Дата выдачи <span class="required">*</span></label>
                <Input 
                    v-model="editData.date_of_issue" 
                    type="date" 
                    :max="today"
                />
            </div>
            <div class="form-group">
                <label>Код подразделения <span class="required">*</span></label>
                <Input 
                    v-model="editData.unit_code" 
                    type="text" 
                    maxlength="7" 
                    @input="formatUnitCode" 
                    placeholder="123-456"
                />
            </div>
            <div class="form-group">
                <label>Кем выдан <span class="required">*</span></label>
                <Input 
                    v-model="editData.issued_by_whom" 
                    type="text" 
                    placeholder="Наименование отделения УФМС"
                />
            </div>
        </div>

        <!-- Футер с кнопками для режима редактирования -->
        <template #footer v-if="editMode">
            <Button @click="editMode = false" variant="secondary">
                Отмена
            </Button>
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
    name: 'PassportDataModal',
    components: {
        Button,
        Input,
        Modal
    },
    props: {
        modelValue: Boolean,
        data: {
            type: Object,
            default: null
        }
    },
    emits: ['update:modelValue', 'close', 'update'],
    setup(props, { emit }) {
        const editMode = ref(false);
        const editData = ref({});
        const isSaving = ref(false);
        const today = new Date().toISOString().split('T')[0];

        watch(() => props.data, (newData) => {
            if (newData) {
                editData.value = { ...newData };
            }
        }, { immediate: true });

        const formatDate = (dateString) => {
            if (!dateString) return '-';
            return new Date(dateString).toLocaleDateString('ru-RU');
        };

        const formatSeries = (e) => {
            editData.value.series = e.target.value.replace(/\D/g, '');
        };

        const formatNumber = (e) => {
            editData.value.number = e.target.value.replace(/\D/g, '');
        };

        const formatUnitCode = (e) => {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 3) {
                value = value.slice(0, 3) + '-' + value.slice(3, 6);
            }
            editData.value.unit_code = value;
        };

        const close = () => {
            editMode.value = false;
            emit('update:modelValue', false);
            emit('close');
        };

        const saveChanges = async () => {
            isSaving.value = true;
            try {
                await emit('update', editData.value);
                editMode.value = false;
            } catch (error) {
                console.error('Ошибка при сохранении:', error);
            } finally {
                isSaving.value = false;
            }
        };

        return {
            editMode,
            editData,
            isSaving,
            today,
            formatDate,
            formatSeries,
            formatNumber,
            formatUnitCode,
            close,
            saveChanges
        };
    }
};
</script>

<style scoped>
.modal-header-actions {
    display: flex;
    gap: 8px;
    margin-bottom: 20px;
}

.view-mode {
    padding: 10px 0;
}

.data-row {
    display: flex;
    padding: 8px 0;
    border-bottom: 1px solid #f0f0f0;
}

.label {
    flex: 0 0 120px;
    font-weight: 600;
    color: #666;
}

.value {
    flex: 1;
    color: #333;
}

.edit-mode {
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 10px 0;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.form-group label {
    font-weight: 500;
    color: #333;
}

.required {
    color: #f44336;
}
</style>