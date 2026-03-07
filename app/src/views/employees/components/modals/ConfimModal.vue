<template>
  <div v-if="show"  @click="onCancel">
    <div @click.stop>
      <div>
        <h3>{{ title }}</h3>
        <button @click="onCancel">X</button>
      </div>
      <div>
        <p>{{ message }}</p>
      </div>
      <div>
        <button @click="onCancel">Отмена</button>
        <button @click="onConfirm">Подтвердить</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmModal',
  props: {
    show: Boolean,
    title: String,
    message: String
  },
  emits: ['confirm', 'cancel'],
  setup(props, { emit }) {
    const onConfirm = () => emit('confirm');
    const onCancel = () => emit('cancel');
    
    return { onConfirm, onCancel };
  }
};
</script>

<style scoped>
</style>