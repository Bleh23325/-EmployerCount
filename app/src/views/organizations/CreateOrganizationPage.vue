<template>
  <div class="create-organization-page">
    <div class="page-header">
      <h1>Создание новой организации</h1>
      <Button @click="goBack" variant="secondary">Назад к списку</Button>
    </div>
    
    <OrganizationForm 
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
import OrganizationForm from './components/OrganizationForm.vue';
import { organizationsApi } from '@/services/organizationsApi';

export default {
  name: 'CreateOrganizationPage',
  components: {
    Button,
    OrganizationForm
  },
  setup() {
    const router = useRouter();
    const serverErrors = ref({});
    
    // Получаем доступ к глобальному объекту уведомлений
    const instance = getCurrentInstance();
    const notify = instance?.appContext.config.globalProperties.$notify;

    const goBack = () => {
      router.push('/organizations');
    };

    const updateServerErrors = (errors) => {
      serverErrors.value = errors;
    };

    const handleSubmit = async (organizationData) => {
      try {
        await organizationsApi.createOrganization(organizationData);
        if (notify) {
          notify.success('Успешно', 'Организация успешно создана');
        } else {
          alert('Организация успешно создана'); // fallback
        }
        router.push('/organizations');
      } catch (err) {
        console.error(err);
        // Проверяем, есть ли ошибки валидации от сервера
        if (err.response?.data?.errors) {
          serverErrors.value = err.response.data.errors;
          // Можно также показать уведомление, что есть ошибки в форме
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
.create-organization-page {
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