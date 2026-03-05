<template>
  <Block title="Документы сотрудника">
    <div class="file-upload-area">
      <!-- Список загруженных файлов -->
      <div v-if="localFiles.length > 0" class="files-list">
        <div v-for="(file, index) in localFiles" :key="index" class="file-item">
          <span class="file-name">{{ file.name }}</span>
          <span class="file-size">{{ formatFileSize(file.size) }}</span>
          <button @click="removeFile(index)" class="remove-btn">×</button>
        </div>
      </div>

      <!-- Область загрузки -->
      <div 
        class="upload-area"
        :class="{ 'drag-over': isDragOver }"
        @dragover.prevent="handleDragOver"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="handleDrop"
      >
        <input
          ref="fileInput"
          type="file"
          multiple
          accept=".jpg,.jpeg,.png,.pdf"
          @change="handleFileSelect"
          style="display: none"
        />
        
        <div class="upload-content">
          <p>Перетащите файлы сюда или</p>
          <Button @click="triggerFileInput">Выберите файлы</Button>
          <p class="file-hint">Допустимые форматы: JPG, PNG, PDF (до 5MB)</p>
        </div>
      </div>

      <!-- Ошибки валидации -->
      <div v-if="errors.file" class="error-message">
        {{ errors.file }}
      </div>
    </div>
  </Block>
</template>

<script>
import { ref, watch } from 'vue';
import { Block, Button } from '@/components/index';

export default {
  name: 'FileUploadForm',
  components: {
    Block,
    Button
  },
  props: {
    modelValue: {
      type: Array,
      default: () => []
    },
    errors: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'validate'],
  setup(props, { emit }) {
    const fileInput = ref(null);
    const localFiles = ref([...props.modelValue]);
    const isDragOver = ref(false);

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const triggerFileInput = () => {
      fileInput.value.click();
    };

    const handleFileSelect = (e) => {
      const files = Array.from(e.target.files);
      addFiles(files);
    };

    const handleDrop = (e) => {
      isDragOver.value = false;
      const files = Array.from(e.dataTransfer.files);
      addFiles(files);
    };

    const handleDragOver = () => {
      isDragOver.value = true;
    };

    const addFiles = (newFiles) => {
      const validFiles = newFiles.filter(file => {
        const isValid = ['image/jpeg', 'image/png', 'application/pdf'].includes(file.type);
        const isSmallEnough = file.size <= 5 * 1024 * 1024;
        return isValid && isSmallEnough;
      });

      localFiles.value = [...localFiles.value, ...validFiles];
      
      if (validFiles.length !== newFiles.length) {
        emit('validate', { file: 'Некоторые файлы не прошли валидацию' });
      }
    };

    const removeFile = (index) => {
      localFiles.value.splice(index, 1);
    };

    watch(localFiles, (newValue) => {
      emit('update:modelValue', newValue);
    }, { deep: true });

    return {
      fileInput,
      localFiles,
      isDragOver,
      formatFileSize,
      triggerFileInput,
      handleFileSelect,
      handleDrop,
      handleDragOver,
      removeFile
    };
  }
};
</script>

<style scoped>
.file-upload-area {
  padding: 20px 0;
}

.files-list {
  margin-bottom: 20px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 4px;
  margin-bottom: 5px;
}

.file-name {
  flex: 1;
  font-weight: 500;
}

.file-size {
  margin-right: 10px;
  color: #666;
  font-size: 12px;
}

.remove-btn {
  width: 24px;
  height: 24px;
  border: none;
  background-color: #ff4444;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.remove-btn:hover {
  background-color: #ff6666;
}

.upload-area {
  border: 2px dashed #ccc;
  border-radius: 4px;
  padding: 40px;
  text-align: center;
  background-color: #fafafa;
  transition: all 0.3s;
}

.upload-area.drag-over {
  border-color: #4CAF50;
  background-color: #e8f5e9;
}

.upload-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.file-hint {
  font-size: 12px;
  color: #999;
  margin-top: 10px;
}

.error-message {
  color: #d32f2f;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}
</style>