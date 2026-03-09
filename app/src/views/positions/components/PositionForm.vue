<template>
  <form @submit.prevent="onSubmit" class="position-form">
    <div class="form-group" :class="{ 'has-error': errors.name || serverErrors.name }">
      <label for="name">Название должности *</label>
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

    <div class="form-group" :class="{ 'has-error': errors.id_department || serverErrors.id_department }">
      <label for="id_department">Отдел *</label>
      <Selector
        id="id_department"
        v-model="form.id_department"
        :options="departmentOptions"
        placeholder="Выберите отдел"
        :class="{ 'error': errors.id_department || serverErrors.id_department }"
        @update:model-value="clearFieldError('id_department')"
      />
      <span v-if="errors.id_department" class="error-text">{{ errors.id_department }}</span>
      <span v-if="serverErrors.id_department" class="error-text">{{ serverErrors.id_department }}</span>
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
import { departmentsApi } from '@/services/departmentsApi';

export default {
  name: 'PositionForm',
  components: { Button, Input, Selector },
  props: {
    initialData: {
      type: Object,
      default: () => ({ name: '', id_department: null, comment: '' })
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
      id_department: props.initialData.id_department || null,
      comment: props.initialData.comment || ''
    });
    const errors = ref({});
    const departments = ref([]);
    const loadingDepartments = ref(false);

    const loadDepartments = async () => {
      loadingDepartments.value = true;
      try {
        departments.value = await departmentsApi.getDepartments();
      } catch (err) {
        console.error('Ошибка загрузки отделов:', err);
      } finally {
        loadingDepartments.value = false;
      }
    };

    const departmentOptions = computed(() => 
      departments.value.map(dept => ({ value: dept.id, label: dept.name }))
    );

    const submitButtonText = computed(() => 
      props.initialData?.id ? 'Сохранить изменения' : 'Создать должность'
    );

    onMounted(loadDepartments);

    const validate = () => {
      const err = {};
      if (!form.value.name?.trim()) err.name = 'Название обязательно';
      if (!form.value.id_department) err.id_department = 'Выберите отдел';
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
      
      // Включаем id_department в отправку
      const payload = {
        name: form.value.name,
        id_department: form.value.id_department,
        comment: form.value.comment || null,
        delete_at: null,
        update_at: null,
        add_at: new Date().toISOString()
      };
      emit('submit', payload);
    };

    return {
      form,
      errors,
      departmentOptions,
      loadingDepartments,
      submitButtonText,
      clearFieldError,
      onSubmit
    };
  }
};
</script>

<style scoped>
.position-form {
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