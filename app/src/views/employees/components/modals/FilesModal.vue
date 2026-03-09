<template>
    <Modal :show="modelValue" :title="'Файлы сотрудника'" @close="close">
        <div>
            <Button @click="addFile" size="small" variant="accent">
                + Добавить файл
            </Button>
        </div>

        <!-- Список файлов -->
        <div v-if="!files || files.length === 0">
            <p>Файлы отсутствуют</p>
        </div>

        <div v-else>
            <div v-for="file in files" :key="file.id">
                <div>
                    <span>{{ file.name || 'Без названия' }}</span>
                    <span>{{ formatDate(file.add_at) }}</span>
                </div>
                <div>
                    <Button @click="viewFile(file)" size="small" variant="secondary">Просмотр</Button>
                </div>
            </div>
        </div>

        <!-- Скрытый input для загрузки файлов -->
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
import { ref} from 'vue';
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
            } else {
                console.error('fileInput не найден');
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

        const viewFile = (file) => {
            if (file.file) {
                if (typeof file.file === 'string') {
                    if (file.file.startsWith('http')) {
                        window.open(file.file, '_blank');
                    } else {
                        const baseUrl = 'http://localhost:5000';
                        const fileUrl = `${baseUrl}${file.file.startsWith('/') ? '' : '/'}${file.file}`;
                        console.log(' Открываем URL:', fileUrl);
                        window.open(fileUrl, '_blank');
                    }
                } else {
                    alert('Файл имеет неправильный формат');
                }
            } else {
                alert('Файл недоступен для просмотра (поле file пустое)');
            }
        };



        return {
            fileInput,
            formatDate,
            close,
            addFile,
            handleFileSelect,
            viewFile
        };
    }
};
</script>