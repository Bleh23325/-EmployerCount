<template>
    <Block>
        <h2>Управление сотрудниками</h2>
    </Block>
    <Block>
        <Button variant="primary" @click="goToCreateEmployee">
            + Создать сотрудника
        </Button>
        <EmployeesTable></EmployeesTable>
    </Block>
</template>
<script>
import { useRouter } from 'vue-router';
import EmployeesTable from './EmployeesTable.vue';
import { Button, Block } from '@/components/index';

export default{
    name:'EmployeesPage',
    components:{
        EmployeesTable,
        Button
    },
    setup() {
        const router = useRouter();

        const goToCreateEmployee = () => {
        router.push('/employees/create');
        };

        return {
        goToCreateEmployee
        };
    }
}
</script>
<style scoped></style>
