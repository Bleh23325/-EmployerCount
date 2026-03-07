<template>
  <div class="edit-department-page">
    <div class="page-header">
      <h1>Редактирование отдела</h1>
      <Button @click="goBack" variant="secondary">Назад к списку</Button>
    </div>
    
    <div v-if="loading" class="loading-indicator">Загрузка данных...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <DepartmentForm
      v-else
      :initialData="department"
      @submit="handleSubmit"
      @cancel="goBack"
      :serverErrors="serverErrors"
      @update:serverErrors="updateServerErrors"
    />
  </div>
</template>

<script>
import { useRouter, useRoute } from 'vue-router';
import { ref, onMounted, getCurrentInstance } from 'vue';
import { Button } from '@/components/index';
import DepartmentForm from './components/DepartmentForm.vue';
import { departmentsApi } from '@/services/departmentsApi';

export default {
  name: 'EditDepartmentPage',
  components: {
    Button,
    DepartmentForm
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const departmentId = route.params.id;

    const department = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const serverErrors = ref({});

    const instance = getCurrentInstance();
    const notify = instance?.appContext.config.globalProperties.$notify;

    const goBack = () => {
      router.push('/departments');
    };

    const updateServerErrors = (errors) => {
      serverErrors.value = errors;
    };

    const fetchDepartment = async () => {
      try {
        loading.value = true;
        const data = await departmentsApi.getDepartment(departmentId);
        department.value = data;
      } catch (err) {
        console.error(err);
        error.value = 'Не удалось загрузить данные отдела';
        if (notify) {
          notify.error('Ошибка', 'Не удалось загрузить данные отдела');
        } else {
          alert('Ошибка загрузки');
        }
      } finally {
        loading.value = false;
      }
    };

    const handleSubmit = async (departmentData) => {
      try {
        await departmentsApi.updateDepartment(departmentId, departmentData);
        if (notify) {
          notify.success('Успешно', 'Отдел успешно обновлён');
        } else {
          alert('Отдел успешно обновлён');
        }
        router.push('/departments');
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

    onMounted(fetchDepartment);

    return {
      department,
      loading,
      error,
      serverErrors,
      goBack,
      handleSubmit,
      updateServerErrors
    };
  }
};
</script>

<style scoped>
.edit-department-page {
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

.loading-indicator {
  text-align: center;
  padding: 40px;
  color: #666;
}

.error-message {
  color: #e62222;
  text-align: center;
  padding: 20px;
}
</style>