<template>
  <Block>
    <h2>Управление должностями</h2>
  </Block>
  <Block>
    <div class="toolbar">
      <div></div>
      <Button variant="primary" @click="goToCreatePosition">
        + Создать должность
      </Button>
      <Input
        v-model="searchQuery"
        type="text"
        placeholder="Поиск по названию..."
        class="search-input"
      />
    </div>
    <PositionsTable :filter="searchQuery"/>
  </Block>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import PositionsTable from './PositionsTable.vue';
import { Button, Block, Input } from '@/components/index';

export default {
  name: 'PositionsPage',
  components: {
    PositionsTable,
    Button,
    Block,
    Input
  },
  setup() {
    const router = useRouter();
    const searchQuery = ref('');

    const goToCreatePosition = () => {
      router.push('/positions/create');
    };

    return {
      searchQuery,
      goToCreatePosition
    };
  }
};
</script>

.toolbar {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 10px;
  align-items: center;
  margin-bottom: 20px;
}

.search-input {
  max-width: 300px;
  justify-self: end;
}

<style scoped></style>