<template>
    <Modal 
        v-if="show"
        :show="true"
        :title="'Редактирование сотрудника'" 
        @update:show="close"
    >
        <div class="modal-body">
            <div class="baseGoriz" style="margin: 20px;">
                <label>Фамилия <span class="required">*</span></label>
                <Input v-model="editData.first_name" type="text" placeholder="Иванов" />
            </div>
            
            <div class="baseGoriz" style="margin: 20px;">
                <label>Имя <span class="required">*</span></label>
                <Input v-model="editData.name" type="text" placeholder="Иван" />
            </div>
            
            <div class="baseGoriz" style="margin: 20px;">
                <label>Отчество</label>
                <Input v-model="editData.patronymic" type="text" placeholder="Иванович" />
            </div>
            
            <div class="baseGoriz" style="margin: 20px;">
                <label>Дата рождения <span class="required">*</span></label>
                <Input v-model="editData.date_of_birth" type="date" :max="today" />
            </div>

            <div class="baseGoriz">
                <label>Организация</label>
                <Selector
                    v-model="editData.id_organization"
                    :options="organizationOptions"
                    placeholder="Выберите организацию"
                />
            </div>

            <div class="baseGoriz">
                <label>Отдел</label>
                <Selector
                    v-model="editData.id_department"
                    :options="departmentOptions"
                    placeholder="Выберите отдел"
                />
            </div>

            <div class="baseGoriz">
                <label>Должность</label>
                <Selector
                    v-model="editData.id_position"
                    :options="positionOptions"
                    placeholder="Выберите должность"
                />
            </div>

            <div class="baseGoriz">
                <label>Оклад</label>
                <Input 
                    v-model="editData.setting_the_salary" 
                    type="number" 
                    placeholder="Введите оклад"
                />
            </div>
        </div>

        <template #footer>
            <Button @click="close" variant="secondary">Отмена</Button>
            <Button @click="saveChanges" variant="primary" :loading="isSaving">
                {{ isSaving ? 'Сохранение...' : 'Сохранить' }}
            </Button>
        </template>
    </Modal>
</template>

<script>
import { ref, watch, onMounted, computed } from 'vue';
import {
    Button,
    Input,
    Modal,
    Selector
} from '@/components/index';
import { employeesApi } from '@/services/employeesApi';

export default {
    name: 'EmployeeEditModal',
    components: {
        Button,
        Input,
        Modal,
        Selector
    },
    props: {
        show: { 
            type: Boolean,
            default: false
        },
        data: {
            type: Object,
            default: null
        }
    },
    emits: ['update:show', 'close', 'update'], 
    setup(props, { emit }) {
        const editData = ref({});
        const isSaving = ref(false);
        const today = new Date().toISOString().split('T')[0];
        
        const organizations = ref([]);
        const departments = ref([]);
        const positions = ref([]);

        const organizationOptions = computed(() => {
            return organizations.value.map(org => ({
                value: org.id,
                label: org.name
            }));
        });

        const departmentOptions = computed(() => {
            return departments.value.map(dept => ({
                value: dept.id,
                label: dept.name
            }));
        });

        const positionOptions = computed(() => {
            return positions.value.map(pos => ({
                value: pos.id,
                label: pos.name
            }));
        });

        const loadDictionaries = async () => {
            try {
                organizations.value = await employeesApi.getOrganizations();
                departments.value = await employeesApi.getDepartments();
                positions.value = await employeesApi.getPositions();
                console.log('Справочники загружены в модалку');
            } catch (error) {
                console.error('Ошибка загрузки справочников:', error);
            }
        };

        const loadEmployeePersonnelData = async (employeeId) => {
            if (!employeeId) return;
            
            try {
                const operations = await employeesApi.getPersonnelOperations(employeeId);
                console.log('Кадровые операции сотрудника:', operations);
                
                if (operations && operations.length > 0) {
                    const latestOp = operations[operations.length - 1];
                    editData.value.id_organization = latestOp.id_organization;
                    editData.value.id_department = latestOp.id_department;
                    editData.value.id_position = latestOp.id_position;
                    editData.value.setting_the_salary = latestOp.setting_the_salary;
                }
            } catch (error) {
                console.error('Ошибка загрузки кадровых данных:', error);
            }
        };

        onMounted(() => {
            loadDictionaries();
        });

        watch(() => props.data, (newData) => {
            if (newData) {
                editData.value = JSON.parse(JSON.stringify(newData));
                
                loadEmployeePersonnelData(newData.id);
            }
        }, { 
            immediate: true,
            deep: true
        });

        const close = () => {
            emit('update:show', false);
            emit('close');
        };

        const saveChanges = async () => {
            isSaving.value = true;
            try {
                await emit('update', {
                    id: editData.value.id,
                    first_name: editData.value.first_name,
                    name: editData.value.name,
                    patronymic: editData.value.patronymic,
                    date_of_birth: editData.value.date_of_birth
                });

                if (editData.value.id_department || editData.value.id_position || editData.value.setting_the_salary) {
                    await employeesApi.createPersonnelOperation({
                        id_employee: editData.value.id,
                        id_department: editData.value.id_department || null,
                        id_position: editData.value.id_position || null,
                        setting_the_salary: editData.value.setting_the_salary || null,
                        salary_change: null,
                        dismissal_from_work: null,
                        delete_at: null,
                        update_at: null,
                        add_at: new Date().toISOString()
                    });
                }

                close();
            } catch (error) {
                console.error('Ошибка при сохранении:', error);
            } finally {
                isSaving.value = false;
            }
        };

        return {
            editData,
            isSaving,
            today,
            close,
            saveChanges,
            organizationOptions,
            departmentOptions,
            positionOptions
        };
    }
};
</script>
<style scored>
.required{
    color:red;
}
</style>