<template>
  <div class="create-position-page">
    <div class="page-header">
      <h1>Создание новой должности</h1>
      <Button @click="goBack" variant="secondary">Назад к списку</Button>
    </div>
    
    <PositionForm
      @submit="handleSubmit"
      @cancel="goBack"
      :serverErrors="serverErrors"
      @update:serverErrors="updateServerErrors"
    />
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref, getCurrentInstance } from 'vue';
import { Button } from '@/components/index';
import PositionForm from './components/PositionForm.vue';
import { positionsApi } from '@/services/positionsApi';

export default {
  name: 'CreatePositionPage',
  components: {
    Button,
    PositionForm
  },
  setup() {
    const router = useRouter();
    const serverErrors = ref({});
    const instance = getCurrentInstance();
    const notify = instance?.appContext.config.globalProperties.$notify;

    const goBack = () => {
      router.push('/positions');
    };

    const updateServerErrors = (errors) => {
      serverErrors.value = errors;
    };

    const handleSubmit = async (positionData) => {
      try {
        await positionsApi.createPosition(positionData);
        if (notify) {
          notify.success('Успешно', 'Должность успешно создана');
        } else {
          alert('Должность успешно создана');
        }
        router.push('/positions');
      } catch (err) {
        console.error(err);
        if (err.response?.data?.errors) {
          serverErrors.value = err.response.data.errors;
          if (notify) {
            notify.error('Ошибка', 'Проверьте правильность заполнения полей');
          }
        } else {
          const message = err.response?.data?.message || err.message || 'Произошла ошибка';
          if (notify) {
            notify.error('Ошибка', message);
          } else {
            alert('Ошибка: ' + message);
          }
        }
      }
    };

    return {
      goBack,
      handleSubmit,
      serverErrors,
      updateServerErrors
    };
  }
};
</script>

<style scoped>
.create-position-page {
  min-height: 100vh;
  background-color: #f5f5f5;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background-color: white;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 20px;
}

.page-header h1 {
  margin: 0;
  color: #333;
  font-size: 24px;
}
</style>