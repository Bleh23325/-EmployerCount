<template>
  <Block title="Документы сотрудника">
    <div class="file-upload-area">
      <Button @click="selectFiles" variant="primary">
        Выбрать файлы
      </Button>
      
      <div v-if="localFiles.length > 0" class="files-list">
        <div v-for="(file, index) in localFiles" :key="index" class="file-item">
          <span class="file-name">{{ file.name }}</span>
          <span class="file-path">{{ file.fullPath }}</span>
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

    const selectFiles = () => {
      const input = document.createElement('input');
      input.type = 'file';
      input.multiple = true;
      
      input.onchange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        
        const filesWithPaths = selectedFiles.map(file => {
        const filePath = file.path || file.name;
          
        const fullPath = filePath;
          
          console.log('Выбран файл:', {
            name: file.name,
            path: filePath,
            fullPath: fullPath
          });
          
          return {
            name: file.name,
            fullPath: fullPath,
            size: file.size
          };
        });
        
        localFiles.value = [...localFiles.value, ...filesWithPaths];
      };
      
      input.click();
    };

    const removeFile = (index) => {
      localFiles.value.splice(index, 1);
    };

    watch(localFiles, (newValue) => {
      emit('update:modelValue', newValue);
    }, { deep: true });

    return {
      localFiles,
      selectFiles,
      removeFile
    };
  }
};
</script>