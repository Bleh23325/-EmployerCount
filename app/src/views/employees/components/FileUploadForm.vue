<template>
  <Block title="Документы сотрудника">
    <div class="file-upload-area">
      <Button @click="selectFiles" variant="primary">
        Выбрать файлы
      </Button>
      
      <div v-if="localFiles.length > 0" class="files-list">
        <div v-for="(file, index) in localFiles" :key="index" class="file-item">
          <span class="file-name">{{ file.name }}</span>
          <span class="file-size">{{ formatFileSize(file.size) }}</span>
          <span class="file-path">{{ file.displayPath }}</span>
          <button @click="removeFile(index)" class="remove-btn">×</button>
        </div>
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
    }
  },
  emits: ['update:modelValue'],
  setup(props, { emit }) {
    const localFiles = ref([...props.modelValue]);

    const formatFileSize = (bytes) => {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    // Сохранение файла в localStorage
    const saveFileToStorage = (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            // Генерируем уникальное имя для файла
            const timestamp = Date.now();
            const safeName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
            const savedName = `${timestamp}-${safeName}`;
            
            // Сохраняем в localStorage
            const files = JSON.parse(localStorage.getItem('uploadedFiles') || '{}');
            files[savedName] = {
              name: file.name,
              data: e.target.result, // Полный base64 data URL
              type: file.type,
              size: file.size
            };
            localStorage.setItem('uploadedFiles', JSON.stringify(files));
            
            resolve({
              name: file.name,
              savedName: savedName,
              displayPath: `/uploads/${savedName}`,
              size: file.size
            });
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file); // Читаем как data URL
      });
    };

    const selectFiles = async () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      
      input.onchange = async (e) => {
        const selectedFiles = Array.from(e.target.files);
        
        for (const file of selectedFiles) {
          try {
            const savedFile = await saveFileToStorage(file);
            
            localFiles.value.push({
              name: file.name,
              size: file.size,
              type: file.type,
              savedName: savedFile.savedName,
              displayPath: savedFile.displayPath,
              fullPath: savedFile.displayPath // Для совместимости
            });
          } catch (error) {
            console.error('Ошибка сохранения файла:', error);
          }
        }
      };
      
      input.click();
    };

    const removeFile = (index) => {
      const file = localFiles.value[index];
      if (file.savedName) {
        // Удаляем из localStorage
        const files = JSON.parse(localStorage.getItem('uploadedFiles') || '{}');
        delete files[file.savedName];
        localStorage.setItem('uploadedFiles', JSON.stringify(files));
      }
      localFiles.value.splice(index, 1);
    };

    watch(localFiles, (newValue) => {
      emit('update:modelValue', newValue.map(f => ({
        name: f.name,
        fullPath: f.displayPath,
        savedName: f.savedName
      })));
    }, { deep: true });

    return {
      localFiles,
      selectFiles,
      removeFile,
      formatFileSize
    };
  }
};
</script>

<style scoped>
.file-upload-area {
  padding: 20px;
}

.files-list {
  margin-top: 20px;
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
  font-weight: bold;
  min-width: 200px;
}

.file-size {
  min-width: 80px;
  color: #666;
  font-size: 12px;
  margin: 0 10px;
}

.file-path {
  flex: 1;
  color: #666;
  font-family: monospace;
  font-size: 12px;
  margin: 0 10px;
  word-break: break-all;
}

.remove-btn {
  width: 24px;
  height: 24px;
  border: none;
  background-color: #ff4444;
  color: white;
  border-radius: 50%;
  cursor: pointer;
}

.remove-btn:hover {
  background-color: #ff6666;
}
</style>