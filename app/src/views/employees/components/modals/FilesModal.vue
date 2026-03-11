<template>
    <Modal :show="modelValue" :title="'Файлы сотрудника'" @close="close">
        <div class="modal-header">
            <Button @click="addFile" size="small" variant="accent">
                + Добавить файл
            </Button>
        </div>

        <div v-if="!files || files.length === 0" class="no-files">
            <p>Файлы отсутствуют</p>
        </div>

        <div v-else class="files-list">
            <div v-for="file in files" :key="file.id" class="file-item">
                <div class="file-info">
                    <span class="file-name">{{ file.name || 'Без названия' }}</span>
                    <span class="file-date">{{ formatDate(file.add_at) }}</span>
                </div>
                <div class="file-actions">
                    <Button @click="downloadFile(file)" size="small" variant="secondary">
                        Скачать
                    </Button>
                </div>
            </div>
        </div>

        <input
            ref="fileInput"
            type="file"
            multiple
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

        const formatDate = (dateString) => {
            if (!dateString) return '';
            return new Date(dateString).toLocaleDateString('ru-RU');
        };

        const close = () => {
            emit('update:modelValue', false);
            emit('close');
        };

        const addFile = () => {
            if (fileInput.value) {
                fileInput.value.click();
            }
        };

        const handleFileSelect = async (e) => {
            const selectedFiles = Array.from(e.target.files);
            try {
                await emit('upload', selectedFiles);
            } catch (error) {
                console.error('Ошибка при загрузке:', error);
            } finally {
                e.target.value = '';
            }
        };

        // Получение данных файла из localStorage
        const getFileData = (file) => {
            try {
                if (!file.file) return null;
                
                // Извлекаем savedName из пути
                const pathParts = file.file.split('/');
                const savedName = pathParts[pathParts.length - 1];
                
                const files = JSON.parse(localStorage.getItem('uploadedFiles') || '{}');
                return files[savedName];
            } catch (error) {
                console.error('Ошибка получения данных файла:', error);
                return null;
            }
        };

        const downloadFile = (file) => {
            console.log('Скачивание файла:', file);
            
            const fileData = getFileData(file);
            
            if (fileData && fileData.data) {
                // Создаем ссылку для скачивания
                const link = document.createElement('a');
                link.href = fileData.data;
                link.download = fileData.name || file.name;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                console.log('Файл скачивается:', fileData.name);
            } else {
                console.error('Данные файла не найдены в localStorage:', file);
                alert('Файл недоступен для скачивания. Возможно, файл был удален из хранилища.');
            }
        };

        return {
            fileInput,
            formatDate,
            close,
            addFile,
            handleFileSelect,
            downloadFile
        };
    }
};
</script>

<style scoped>
.modal-header {
    margin-bottom: 20px;
}

.no-files {
    padding: 40px 20px;
    text-align: center;
    color: #999;
}

.files-list {
    margin-top: 20px;
    max-height: 400px;
    overflow-y: auto;
}

.file-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    background-color: #f9f9f9;
    border: 1px solid #ddd;
    border-radius: 4px;
    margin-bottom: 10px;
}

.file-info {
    display: flex;
    flex-direction: column;
    flex: 1;
}

.file-name {
    font-weight: bold;
    margin-bottom: 5px;
}

.file-date {
    font-size: 12px;
    color: #666;
}

.file-actions {
    display: flex;
    gap: 5px;
    margin-left: 15px;
}
</style>