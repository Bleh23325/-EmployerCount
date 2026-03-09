<template>
  <form @submit.prevent="onSubmit" class="department-form">
    <div class="form-group" :class="{ 'has-error': errors.name || serverErrors.name }">
      <label for="name">Название отдела *</label>
      <Input
        id="name"
        v-model="form.name"
        type="text"
        required
        :class="{ 'error': errors.name || serverErrors.name }"
        @input="clearFieldError('name')"
      />
      <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
      <span v-if="serverErrors.name" class="error-text">{{ serverErrors.name }}</span>
    </div>

    <div class="form-group" :class="{ 'has-error': errors.id_organization || serverErrors.id_organization }">
      <label for="id_organization">Организация *</label>
      <Selector
        id="id_organization"
        v-model="form.id_organization"
        :options="organizationOptions"
        placeholder="Выберите организацию"
        :class="{ 'error': errors.id_organization || serverErrors.id_organization }"
        @update:model-value="clearFieldError('id_organization')"
      />
      <span v-if="errors.id_organization" class="error-text">{{ errors.id_organization }}</span>
      <span v-if="serverErrors.id_organization" class="error-text">{{ serverErrors.id_organization }}</span>
    </div>

    <div class="form-group" :class="{ 'has-error': errors.parent || serverErrors.parent }">
      <label for="parent">Родительский отдел (если есть)</label>
      <Selector
        id="parent"
        v-model="form.parent"
        :options="departmentOptions"
        placeholder="Выберите родительский отдел"
        :class="{ 'error': errors.parent || serverErrors.parent }"
        @update:model-value="clearFieldError('parent')"
      />
      <span v-if="errors.parent" class="error-text">{{ errors.parent }}</span>
      <span v-if="serverErrors.parent" class="error-text">{{ serverErrors.parent }}</span>
    </div>

    <div class="form-group" :class="{ 'has-error': serverErrors.comment }">
      <label for="comment">Комментарий</label>
      <Input
        id="comment"
        v-model="form.comment"
        type="textarea"
        rows="3"
        :class="{ 'error': serverErrors.comment }"
        @input="clearFieldError('comment')"
      />
      <span v-if="serverErrors.comment" class="error-text">{{ serverErrors.comment }}</span>
    </div>

    <div class="form-actions">
      <Button type="submit" variant="primary">{{ submitButtonText }}</Button>
      <Button type="button" variant="secondary" @click="$emit('cancel')">Отмена</Button>
    </div>
  </form>
</template>

<script>
import { ref, onMounted, computed } from 'vue'; 
import { Button, Input, Selector } from '@/components/index';
import { organizationsApi } from '@/services/organizationsApi';
import { departmentsApi } from '@/services/departmentsApi';

export default {
  name: 'DepartmentForm',
  components: { Button, Input, Selector },
  props: {
    initialData: {
      type: Object,
      default: () => ({ name: '', id_organization: null, parent: null, comment: '' })
    },
    serverErrors: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['submit', 'cancel', 'update:serverErrors'],
  setup(props, { emit }) {
    const form = ref({
      name: props.initialData.name || '',
      id_organization: props.initialData.id_organization || null,
      parent: props.initialData.parent || null,
      comment: props.initialData.comment || ''
    });
    const errors = ref({});
    const organizations = ref([]);
    const departments = ref([]);
    const loadingOrganizations = ref(false);
    const loadingDepartments = ref(false);

    // Загрузка списка организаций
    const loadOrganizations = async () => {
      loadingOrganizations.value = true;
      try {
        organizations.value = await organizationsApi.getOrganizations();
      } catch (err) {
        console.error('Ошибка загрузки организаций:', err);
      } finally {
        loadingOrganizations.value = false;
      }
    };

    // Загрузка списка отделов
    const loadDepartments = async () => {
      loadingDepartments.value = true;
      try {
        const allDepts = await departmentsApi.getDepartments();
        departments.value = allDepts;
      } catch (err) {
        console.error('Ошибка загрузки отделов:', err);
      } finally {
        loadingDepartments.value = false;
      }
    };

    // Опции для организации
    const organizationOptions = computed(() => 
      organizations.value.map(org => ({ value: org.id, label: org.name }))
    );

    // Опции для родительского отдела с фильтрацией текущего отдела
    const departmentOptions = computed(() => {
      let filtered = departments.value;
      // Если передан ID текущего отдела (в режиме редактирования), исключаем его из списка
      if (props.initialData?.id) {
        filtered = departments.value.filter(dept => dept.id !== props.initialData.id);
      }
      return filtered.map(dept => ({ value: dept.id, label: dept.name }));
    });

     const submitButtonText = computed(() => 
      props.initialData?.id ? 'Сохранить изменения' : 'Создать отдел'
    );

    onMounted(() => {
      loadOrganizations();
      loadDepartments();
    });

    const validate = () => {
      const err = {};
      if (!form.value.name?.trim()) err.name = 'Название обязательно';
      if (!form.value.id_organization) err.id_organization = 'Выберите организацию';
      return err;
    };

    const clearFieldError = (field) => {
      if (errors.value[field]) errors.value[field] = null;
      if (props.serverErrors[field]) {
        const newErrors = { ...props.serverErrors };
        delete newErrors[field];
        emit('update:serverErrors', newErrors);
      }
    };

    const onSubmit = () => {
      const err = validate();
      if (Object.keys(err).length) {
        errors.value = err;
        return;
      }
      emit('update:serverErrors', {});
      
      const payload = {
        ...form.value,
        delete_at: null,
        update_at: null,
        add_at: new Date().toISOString() 
      };
      emit('submit', payload);
    };

    return {
      form,
      errors,
      organizationOptions,
      departmentOptions,
      loadingOrganizations,
      loadingDepartments,
      clearFieldError,
      onSubmit,
      submitButtonText
    };
  }
};
</script>

<style scoped>
.department-form {
  max-width: 600px;
  margin: 0 auto;
  background: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.error-text {
  color: #e62222;
  font-size: 14px;
  margin-top: 5px;
  display: block;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 20px;
}
</style>