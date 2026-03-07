<template>
    <Modal :show="modelValue" :title="'Файлы сотрудника'" @close="close">
        <div class="modal-header-actions">
            <Button @click="addFile" size="small" variant="primary" :loading="isUploading">
                {{ isUploading ? 'Загрузка...' : '+ Добавить файл' }}
            </Button>
        </div>

        <!-- Список файлов -->
        <div v-if="!files || files.length === 0" class="no-files">
            <p>Файлы отсутствуют</p>
            <Button @click="addFile" variant="primary">Загрузить файл</Button>
        </div>

        <div v-else class="files-list">
            <div v-for="file in files" :key="file.id" class="file-item">
                <div class="file-info">
                    <span class="file-name">{{ file.name || 'Без названия' }}</span>
                    <span class="file-date">{{ formatDate(file.add_at) }}</span>
                </div>
                <div class="file-actions">
                    <Button @click="viewFile(file)" size="small" variant="icon" title="Просмотр">👁</Button>
                    <Button @click="downloadFile(file)" size="small" variant="icon" title="Скачать">⬇</Button>
                </div>
            </div>
        </div>

        <!-- Скрытый input для загрузки файлов -->
        <input
            ref="fileInput"
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.pdf"
            style="display: none"
            @change="handleFileSelect"
        />
    </Modal>
</template>

<script>
import { ref } from 'vue';
import {
    Button,
    Modal
} from '@/components/index';

export default {
    name: 'FilesModal',
    components: {
        Button,
        Modal
    },
    props: {
        modelValue: Boolean,
        files: {
            type: Array,
            default: () => []
        },
        employeeId: {
            type: Number,
            required: true
        }
    },
    emits: ['update:modelValue', 'close', 'upload'],
    setup(props, { emit }) {
        const fileInput = ref(null);
        const isUploading = ref(false);

        const formatDate = (dateString) => {
            if (!dateString) return '';
            return new Date(dateString).toLocaleDateString('ru-RU');
        };

        const close = () => {
            emit('update:modelValue', false);
            emit('close');
        };

        const addFile = () => {
            fileInput.value.click();
        };

        const handleFileSelect = async (e) => {
            const files = Array.from(e.target.files);
            isUploading.value = true;
            try {
                await emit('upload', files);
            } finally {
                isUploading.value = false;
                // Сбрасываем input, чтобы можно было загрузить тот же файл снова
                e.target.value = '';
            }
        };

        const viewFile = (file) => {
            if (file.file) {
                window.open(file.file, '_blank');
            }
        };

        const downloadFile = (file) => {
            if (file.file) {
                const link = document.createElement('a');
                link.href = file.file;
                link.download = file.name || 'file';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        };

        return {
            fileInput,
            isUploading,
            formatDate,
            close,
            addFile,
            handleFileSelect,
            viewFile,
            downloadFile
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

.no-files {
    text-align: center;
    padding: 40px 20px;
    color: #666;
}

.files-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    max-height: 400px;
    overflow-y: auto;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px;
    background-color: #f9f9f9;
    border: 1px solid #eee;
    border-radius: 4px;
}

.file-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.file-name {
    font-weight: 500;
    color: #333;
}

.file-date {
    font-size: 12px;
    color: #999;
}

.file-actions {
    display: flex;
    gap: 5px;
}
</style>