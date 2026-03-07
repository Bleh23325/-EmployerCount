<template>
  <div class="create-organization-page">
    <div class="page-header">
      <h1>Создание новой организации</h1>
      <Button @click="goBack" variant="secondary">Назад к списку</Button>
    </div>
    
    <OrganizationForm @submit="handleSubmit" @cancel="goBack" />
  </div>
</template>

<script>
import { useRouter } from 'vue-router';
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

    const goBack = () => {
      router.push('/organizations');
    };

    const handleSubmit = async (organizationData) => {
      try {
        await organizationsApi.createOrganization(organizationData);
        alert('Организация успешно создана');
        router.push('/organizations');
      } catch (err) {
        alert('Ошибка: ' + err.message);
      }
    };

    return {
      goBack,
      handleSubmit
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