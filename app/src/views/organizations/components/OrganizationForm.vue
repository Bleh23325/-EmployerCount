<template>
  <form @submit.prevent="onSubmit" class="organization-form">
    <div class="form-group">
      <label for="name">Название организации *</label>
      <Input
        id="name"
        v-model="form.name"
        type="text"
        required
        :class="{ 'error': errors.name }"
      />
      <span v-if="errors.name" class="error-text">{{ errors.name }}</span>
    </div>

    <div class="form-group">
      <label for="comment">Комментарий</label>
      <Input
        id="comment"
        v-model="form.comment"
        type="textarea"
        rows="3"
      />
    </div>

    <div class="form-actions">
      <Button type="submit" variant="primary">Сохранить</Button>
      <Button type="button" variant="secondary" @click="$emit('cancel')">Отмена</Button>
    </div>
  </form>
</template>

<script>
import { ref } from 'vue';
import { Button, Input } from '@/components/index';

export default {
  name: 'OrganizationForm',
  components: { Button, Input },
  props: {
    initialData: {
      type: Object,
      default: () => ({ name: '', comment: '' })
    }
  },
  emits: ['submit', 'cancel'],
  setup(props, { emit }) {
    const form = ref({
      name: props.initialData.name || '',
      comment: props.initialData.comment || ''
    });
    const errors = ref({});

    const validate = () => {
      const err = {};
      if (!form.value.name.trim()) err.name = 'Название обязательно';
      return err;
    };

    const onSubmit = () => {
      const err = validate();
      if (Object.keys(err).length) {
        errors.value = err;
        return;
      }
      emit('submit', { ...form.value });
    };

    return {
      form,
      errors,
      onSubmit
    };
  }
};
</script>

<style scoped>
.organization-form {
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