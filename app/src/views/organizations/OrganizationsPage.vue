<template>
    <Block>
        <h2>Управление организациями</h2>
    </Block>
    <Block>
        <Button variant="primary" @click="goToCreateOrganization">
            + Создать организацию
        </Button>
        <OrganizationsTable></OrganizationsTable>
    </Block>
</template>

<script>
import { useRouter } from 'vue-router';
import OrganizationsTable from './OrganizationsTable.vue'; 
import { Button, Block } from '@/components/index';

export default {
    name: 'OrganizationsPage',
    components: {
        OrganizationsTable,
        Button,
        Block
    },
    setup() {
        const router = useRouter();

        const goToCreateOrganization = () => {
            router.push('/organizations/create');
        };

        return {
            goToCreateOrganization
        };
    }
}
</script>

<style scoped></style>