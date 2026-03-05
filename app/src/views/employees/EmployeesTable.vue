<template>
    <div class="employees-table-container">
        <div v-if="loading" class="loading-indicator">
            Загрузка данных
        </div>

        <table v-else class="employees-table">
            <thead>
                <tr>
                    <th>Номер</th>
                    <th>Фамилия</th>
                    <th>Имя</th>
                    <th>Отчество</th>
                    <th>Дата рождения</th>
                    <th>Подробнее</th>
                    <th>Действия</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="employee in employees" :key="empployee?.id ">
                    <td>{{ employee.id }}</td>
                    <td>{{ employee.first_name }}</td>
                    <td>{{ employee.name }}</td>
                    <td>{{ employee.patronymic }}</td>
                    <td>{{ formatDate(employee.date_of_birth) }}</td>
                    <td class="action-cell">
                        <Button @click="viewPassportData(employee.id_passport_data)">
                            Паспорт
                        </Button>
                        <Button @click="viewRegistrationAddress(employee.id_registration_address)" >
                            Адрес
                        </Button>
                        <Button @click="viewEmployeeFiles(employee.id)"  variant="secondary">
                            Файлы
                        </Button>

                    </td>
                    <td>
                        <Button @click="DeleteEmployee(employee.id)" class="deleteBtn">
                            Удалить
                        </Button>
                        <Button @click="DeleteEmployee(employee.id)" variant="accent">
                            Добавить
                        </Button>
                    </td>
                </tr>
            </tbody>
        </table>


        <Modal v-model="showPassportModal" title="Паспортные данные">
            <PassportDataView :passportData="selectedPassportData" v-if="selectedPassportData"/>
        </Modal>

        <Modal v-model="showAddressModal" title="Адрес регистрации">
            <RegistrationAddressView :addressData="selecteAddressData" v-if="selectedAddressData"/>
        </Modal>

        <Modal v-model="showFilesModal" title="Файлы сотрудника">
            <FilesView :files="selectedEmployeeFiles" :employeeId="selectedEmployeeId" v-if="selectedEmployeeFiles"/>
        </Modal>
    </div>


 <!-- <PassportDataModal
      v-model="showPassportModal"
      :data="selectedPassportData"
      @close="showPassportModal = false"
      @update="handleUpdatePassport"
      @delete="handleDeletePassport"
    />
    
    <AddressModal
      v-model="showAddressModal"
      :data="selectedAddressData"
      @close="showAddressModal = false"
      @update="handleUpdateAddress"
      @delete="handleDeleteAddress"
    />
    
    <FilesModal
      v-model="showFilesModal"
      :files="selectedEmployeeFiles"
      :employee-id="selectedEmployeeId"
      @close="showFilesModal = false"
      @upload="handleUploadFile"
      @delete="handleDeleteFile"
    />
    
    <ConfirmModal
      :show="showConfirmModal"
      :title="confirmTitle"
      :message="confirmMessage"
      @confirm="executeConfirm"
      @cancel="cancelConfirm"
    />
    
-->  

</template>

<script>
import {ref, onMounted} from 'vue';
import { employeesApi } from '@/services/employeesApi';
import{
    Button,
    Input,
    Block,
    Checkbox,
    Modal,
    Notification,
    Selector
} from '@/components/index';
import PassportDataView from './PassportDataView.vue'
import RegistrationAddressView from './RegistrationAddressView.vue';
import FilesView from './FilesView.vue';
/*import PassportDataModal from './components/modals/PassportDataModal.vue';
import AddressModal from './components/modals/AddressModal.vue';
import FilesModal from './components/modals/FilesModal.vue';
import ConfirmModal from './components/modals/ConfimModal.vue';*/

export default {
    name:'EmployeesTable',
    components:{
        Button,
        Modal,
        PassportDataView,
        RegistrationAddressView,
        FilesView,
        /*PassportDataModal,
        AddressModal,
        FilesModal,
        ConfirmModal*/
    },
    setup(){
        const refreshEmployees = async () => {
            try {
                loading.value = true;
                employees.value = await employeesApi.getEmployees();
            } catch (err) {
                error.value = 'Не удалось загрузить список сотрудников';
                console.error(err);
            } finally {
                loading.value = false;
            }
        };
        const employees = ref([]);
        const loading = ref(true);
        const error = ref(null);

        const showPassportModal = ref(false);
        const showAddressModal = ref(false);
        const showFilesModal = ref(false);

        const selectedPassportData = ref(null);
        const selectedAddressData = ref(null);
        const selectedEmployeeFiles = ref([]);
        const selectedEmployeeId = ref(null);

        const formatDate = (dateString) => {
            if (!dateString) return '—';
            return new Date(dateString).toLocaleDateString('ru-RU');
        };

        const loadEmployees = async () => {
            try {
                loading.value = true;
                employees.value = await employeesApi.getEmployees();
            } catch (err) {
                error.value = 'Не удалось загрузить список сотрудников';
                console.error(err);
            } finally {
                loading.value = false;
            }
        };

        const viewPassportData = async (passportDataId) => {
            if (!passportDataId) {
                alert('Паспортные данные отсутствуют');
                return;
            }
            
            try {
                const data = await employeesApi.getPassportData(passportDataId);
                selectedPassportData.value = data;
                showPassportModal.value = true;
            } catch (err) {
                alert('Ошибка при загрузке паспортных данных');
            }
        };

        const viewRegistrationAddress = async (addressId) => {
            if (!addressId) {
                alert('Адрес регистрации отсутствует');
                return;
            }
            
            try {
                const data = await employeesApi.getRegistrationAddress(addressId);
                selectedAddressData.value = data;
                showAddressModal.value = true;
            } catch (err) {
                alert('Ошибка при загрузке адреса регистрации');
            }
        };

        const viewEmployeeFiles = async (employeeId) => {
            try {
                selectedEmployeeId.value = employeeId;
                const files = await employeesApi.getEmployeeFiles(employeeId);
                selectedEmployeeFiles.value = files;
                showFilesModal.value = true;
            } catch (err) {
                alert('Ошибка при загрузке файлов');
            }
        };

        onMounted(() => {
            loadEmployees();
        });

        return {
            employees,
            loading,
            error,
            formatDate,
            viewPassportData,
            viewRegistrationAddress,
            viewEmployeeFiles,
            showPassportModal,
            showAddressModal,
            showFilesModal,
            selectedPassportData,
            selectedAddressData,
            selectedEmployeeFiles,
            selectedEmployeeId
        };
    }
}
</script>
<style scoped>
.employees-table-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.employees-table {
  width: 100%;
  border-collapse: collapse;
  background-color: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.employees-table th {
  background-color: #f5f5f5;
  padding: 12px;
  text-align: left;
  font-weight: 600;
  border-bottom: 2px solid #ddd;
}

.employees-table td {
  padding: 12px;
  border-bottom: 1px solid #eee;
}

.loading-indicator {
  text-align: center;
  padding: 40px;
  color: #666;
}



.deleteBtn{
    border:none;
    border-radius:4px;
    padding: 10px 20px;
    margin: 10px 20px;
    font-size: 1em;
    cursor: pointer;
    color:white;
    transition:all 300ms ease;
    background: #e62222;
}
.deleteBtn:hover:not(:disabled){
    background:#d30700;
    transform:translateY(-5px) ;
}
</style>