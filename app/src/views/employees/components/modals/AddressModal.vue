<template>
    <Modal :show="modelValue" :title="'Адрес регистрации'" @close="close">
        <div class="modal-header-actions">
            <Button @click="editMode = !editMode" size="small" variant="secondary">
                {{ editMode ? 'Отмена' : 'Изменить' }}
            </Button>
        </div>

        <!-- Режим просмотра -->
        <div v-if="!editMode && data" class="view-mode">
            <div class="data-row">
                <span class="label">Регион:</span>
                <span class="value">{{ data.region || '-' }}</span>
            </div>
            <div class="data-row">
                <span class="label">Населенный пункт:</span>
                <span class="value">{{ data.locality || '-' }}</span>
            </div>
            <div class="data-row">
                <span class="label">Улица:</span>
                <span class="value">{{ data.street || '-' }}</span>
            </div>
            <div class="data-row">
                <span class="label">Дом:</span>
                <span class="value">{{ data.house || '-' }}</span>
            </div>
            <div class="data-row" v-if="data.building">
                <span class="label">Корпус:</span>
                <span class="value">{{ data.building || '-' }}</span>
            </div>
            <div class="data-row" v-if="data.apartament">
                <span class="label">Квартира:</span>
                <span class="value">{{ data.apartament || '-' }}</span>
            </div>
        </div>

        <!-- Режим редактирования -->
        <div v-if="editMode && data" class="edit-mode">
            <div class="form-group">
                <label>Регион <span class="required">*</span></label>
                <Input v-model="editData.region" type="text" placeholder="Край, область, республика" />
            </div>
            <div class="form-group">
                <label>Населенный пункт <span class="required">*</span></label>
                <Input v-model="editData.locality" type="text" placeholder="Город, поселок, село" />
            </div>
            <div class="form-group">
                <label>Улица <span class="required">*</span></label>
                <Input v-model="editData.street" type="text" placeholder="Улица" />
            </div>
            <div class="form-group">
                <label>Дом <span class="required">*</span></label>
                <Input v-model="editData.house" type="text" placeholder="123" />
            </div>
            <div class="form-group">
                <label>Корпус/строение</label>
                <Input v-model="editData.building" type="text" placeholder="2" />
            </div>
            <div class="form-group">
                <label>Квартира</label>
                <Input v-model="editData.apartament" type="text" placeholder="45" />
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
    name: 'AddressModal',
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

        watch(() => props.data, (newData) => {
            if (newData) {
                editData.value = { ...newData };
            }
        }, { immediate: true });

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