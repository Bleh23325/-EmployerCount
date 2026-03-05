<template>
  <div class="files-view">
    <div v-if="!files || files.length === 0" class="no-files">
      <p>Файлы отсутствуют</p>
    </div>
    
    <div v-else class="files-list">
      <div v-for="file in files" :key="file.id" class="file-item">
        <div class="file-info">
          <span class="file-name">{{ file.name }}</span>
          <span class="file-date" v-if="file.upload_date">
            {{ formatDate(file.upload_date) }}
          </span>
        </div>
        
        <div class="file-actions">
          <Button 
            @click="viewFile(file)"
            size="small"
            variant="outline"
          >
            Просмотр
          </Button>
          
          <Button 
            @click="downloadFile(file)"
            size="small"
            variant="outline"
          >
            Скачать
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { defineProps } from 'vue';
import{
    Button,
    Input,
    Block,
    Checkbox,
    Modal,
    Notification,
    Selector
} from '@/components/index';

export default {
  name: 'FilesView',
  components: {
    Button
  },
  props: {
    files: {
      type: Array,
      default: () => []
    },
    employeeId: {
      type: Number,
      required: true
    }
  },
  setup(props) {
    const formatDate = (dateString) => {
      if (!dateString) return '';
      return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const viewFile = (file) => {
      // Открываем файл в новой вкладке
      window.open(file.file, '_blank');
    };

    const downloadFile = (file) => {
      // Создаем ссылку для скачивания
      const link = document.createElement('a');
      link.href = file.file;
      link.download = file.name || 'file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    return {
      formatDate,
      viewFile,
      downloadFile
    };
  }
};
</script>

<style scoped>
.files-view {
  padding: 20px;
  min-width: 400px;
}

.files-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.file-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: #f9f9f9;
  border-radius: 4px;
  border: 1px solid #eee;
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
  gap: 8px;
}

.no-files {
  text-align: center;
  color: #999;
  padding: 20px;
}
</style>