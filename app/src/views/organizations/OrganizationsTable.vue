<template>
  <div class="organizations-table-container">
    <div v-if="loading" class="loading-indicator">Загрузка...</div>
    <div v-else-if="error" class="error-message">{{ error }}</div>
    <table v-else class="organizations-table">
      <thead>
        <tr>
          <th>Название</th>
          <th>Комментарий</th>
          <th>Дата создания</th>
          <th>Действия</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="org in organizations" :key="org.id">
          <td>{{ org.name }}</td>
          <td>{{ org.comment || '—' }}</td>
          <td>{{ formatDate(org.add_at) }}</td>
          <td>
            <Button @click="editOrganization(org.id)" variant="secondary">Редактировать</Button>
            <Button @click="deleteOrganization(org.id)" class="deleteBtn">Удалить</Button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import { Button } from '@/components/index';
import { organizationsApi } from '@/services/organizationsApi';
import { useRouter } from 'vue-router';

export default {
  name: 'OrganizationsTable',
  components: { Button },
  setup() {
    const router = useRouter();
    const organizations = ref([]);
    const loading = ref(true);
    const error = ref(null);

    const formatDate = (dateString) => {
      if (!dateString) return '—';
      return new Date(dateString).toLocaleDateString('ru-RU');
    };

    const fetchOrganizations = async () => {
      try {
        loading.value = true;
        organizations.value = await organizationsApi.getOrganizations();
      } catch (err) {
        error.value = err.message || 'Не удалось загрузить список организаций';
      } finally {
        loading.value = false;
      }
    };

    const editOrganization = (id) => {
      router.push(`/organizations/edit/${id}`);
    };

    const deleteOrganization = async (id) => {
      if (!confirm('Вы уверены, что хотите удалить организацию?')) return;
      try {
        await organizationsApi.deleteOrganization(id);
        await fetchOrganizations();
      } catch (err) {
        alert('Ошибка при удалении: ' + err.message);
      }
    };

    onMounted(fetchOrganizations);

    return {
      organizations,
      loading,
      error,
      formatDate,
      editOrganization,
      deleteOrganization
    };
  }
};
</script>

<style scoped>
.organizations-table-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.organizations-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.organizations-table th {
  background-color: #f5f5f5;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
}

.organizations-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
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

.deleteBtn {
  border: none;
  border-radius: 4px;
  padding: 8px 16px;
  margin: 0 4px;
  font-size: 0.9em;
  cursor: pointer;
  color: white;
  transition: all 300ms ease;
  background: #e62222;
}
.deleteBtn:hover:not(:disabled) {
  background: #d30700;
  transform: translateY(-2px);
}
</style>