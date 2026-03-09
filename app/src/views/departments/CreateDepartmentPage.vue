<template>
  <div class="create-department-page">
    <div class="page-header">
      <h1>Создание нового отдела</h1>
      <Button @click="goBack" variant="secondary">Назад к списку</Button>
    </div>
    
    <DepartmentForm
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
import DepartmentForm from './components/DepartmentForm.vue';
import { departmentsApi } from '@/services/departmentsApi';

export default {
  name: 'CreateDepartmentPage',
  components: {
    Button,
    DepartmentForm
  },
  setup() {
    const router = useRouter();
    const serverErrors = ref({});
    const instance = getCurrentInstance();
    const notify = instance?.appContext.config.globalProperties.$notify;

    const goBack = () => {
      router.push('/departments');
    };

    const updateServerErrors = (errors) => {
      serverErrors.value = errors;
    };

    const handleSubmit = async (departmentData) => {
      try {
        await departmentsApi.createDepartment(departmentData);
        if (notify) {
          notify.success('Успешно', 'Отдел успешно создан');
        } else {
          alert('Отдел успешно создан');
        }
        router.push('/departments');
      } catch (err) {
        console.error(err);
        // Если сервер вернул ошибки валидации по полям
        if (err.response?.data?.errors) {
          serverErrors.value = err.response.data.errors;
          if (notify) {
            notify.error('Ошибка', 'Проверьте правильность заполнения полей');
          }
        } else {
          // Общая ошибка
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
.create-department-page {
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