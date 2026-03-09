<template>
  <Block>
    <h2>Управление должностями</h2>
  </Block>
  <Block>
    <Button variant="primary" @click="goToCreatePosition">
      + Создать должность
    </Button>
    <PositionsTable />
  </Block>
</template>

<script>
import { useRouter } from 'vue-router';
import PositionsTable from './PositionsTable.vue';
import { Button, Block } from '@/components/index';

export default {
  name: 'PositionsPage',
  components: {
    PositionsTable,
    Button,
    Block
  },
  setup() {
    const router = useRouter();

    const goToCreatePosition = () => {
      router.push('/positions/create');
    };

    return {
      goToCreatePosition
    };
  }
};
</script>

<style scoped></style>