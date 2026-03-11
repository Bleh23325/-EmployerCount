<template>
  <Teleport to="body">
    <div v-if="show" class="ui-modal-overlay" @click="handleOverlayClick">
      <div class="ui-modal" :class="{ 'ui-modal--large': large }" @click.stop>
        <div class="ui-modal__header">
          <h3 class="ui-modal__title">{{ title }}</h3>
          <button class="ui-modal__close" @click="closeModal">&times;</button>
        </div>

        <div class="ui-modal__content">
          <slot />
        </div>

        <div v-if="$slots.footer" class="ui-modal__footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script>
export default {
  name: 'UiModal',
  props: {
    show: Boolean,
    title: String,
    large: Boolean,
    closeOnOverlay: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['update:show'],
  methods: {
    closeModal() {
      this.$emit('update:show', false)
    },
    handleOverlayClick() {
      if (this.closeOnOverlay) {
        this.closeModal()
      }
    },
  },
}
</script>

<style scoped>
.ui-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.ui-modal {
  background-color: white;
  border-radius: 8px;
  min-width: 300px;
  max-width: 500px;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.ui-modal--large {
  min-width: 500px;
  max-width: 800px;
}

.ui-modal__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  border-bottom: 1px solid #eee;
}

.ui-modal__title {
  margin: 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.ui-modal__close {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #999;
  padding: 0;
  line-height: 1;
}

.ui-modal__close:hover {
  color: #333;
}

.ui-modal__content {
  padding: 20px;
}

.ui-modal__footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}
</style>
