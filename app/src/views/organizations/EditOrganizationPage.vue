<template>
  <div class="edit-organization-page">
    <div class="page-header">
      <h1>Редактирование организации</h1>
      <Button @click="goBack" variant="secondary">Назад к списку</Button>
    </div>
    
    <div v-if="loading" class="loading-indicator">Загрузка данных...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <OrganizationForm 
      v-else
      :initialData="organization"
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
import OrganizationForm from './components/OrganizationForm.vue';
import { organizationsApi } from '@/services/organizationsApi';

export default {
  name: 'EditOrganizationPage',
  components: {
    Button,
    OrganizationForm
  },
  setup() {
    const router = useRouter();
    const route = useRoute();
    const organizationId = route.params.id;

    const organization = ref(null);
    const loading = ref(true);
    const error = ref(null);
    const serverErrors = ref({});

    const instance = getCurrentInstance();
    const notify = instance?.appContext.config.globalProperties.$notify;

    const goBack = () => {
      router.push('/organizations');
    };

    const updateServerErrors = (errors) => {
      serverErrors.value = errors;
    };

    const fetchOrganization = async () => {
      try {
        loading.value = true;
        organization.value = await organizationsApi.getOrganization(organizationId);
      } catch (err) {
        console.error(err);
        error.value = 'Не удалось загрузить данные организации';
        if (notify) {
          notify.error('Ошибка', 'Не удалось загрузить данные организации');
        } else {
          alert('Ошибка загрузки');
        }
      } finally {
        loading.value = false;
      }
    };

    const handleSubmit = async (organizationData) => {
      try {
        await organizationsApi.updateOrganization(organizationId, organizationData);
        if (notify) {
          notify.success('Успешно', 'Организация успешно обновлена');
        } else {
          alert('Организация успешно обновлена');
        }
        router.push('/organizations');
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

    onMounted(fetchOrganization);

    return {
      organization,
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
.edit-organization-page {
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