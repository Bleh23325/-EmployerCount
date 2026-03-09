<template>
    <Block>
        <h2>Управление организациями</h2>
    </Block>
    <Block>
        <div class="toolbar">
            <div></div>
             <Button variant="primary" @click="goToCreateOrganization">
                + Создать организацию
            </Button>
            <Input
                v-model="searchQuery"
                type="text"
                placeholder="Поиск по названию..."
                class="search-input"
            />
        </div>
        <OrganizationsTable :filter="searchQuery"/>
    </Block>
</template>

<script>
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import OrganizationsTable from './OrganizationsTable.vue'; 
import { Button, Block, Input } from '@/components/index';

export default {
    name: 'OrganizationsPage',
    components: {
        OrganizationsTable,
        Button,
        Block,
        Input
    },
    setup() {
        const router = useRouter();
        const searchQuery = ref(''); 

        const goToCreateOrganization = () => {
            router.push('/organizations/create');
        };

        return {
            searchQuery,
            goToCreateOrganization
        };
    }
}
</script>

<style scoped>

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

</style>