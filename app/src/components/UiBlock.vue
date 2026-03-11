<template>
  <div class="ui-block">
    <h2 v-if="title" class="ui-block__title">{{ title }}</h2>
    <div class="ui-block__content">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'UiBlock',
  props: {
    title: String,
  },
}
</script>

<style scoped>
.ui-block {
  background-color: white;
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  margin-bottom: 20px;
}

.ui-block__title {
  margin: 0 0 20px 0;
  font-size: 18px;
  font-weight: 500;
  color: #333;
}

.ui-block__content {
  color: #666;
}
</style>
