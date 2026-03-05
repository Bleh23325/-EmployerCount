<template>
  <div class="passport-data-view">
    <div v-if="!passportData" class="no-data">
      <p>Паспортные данные отсутствуют</p>
    </div>
    
    <div v-else class="data-grid">
      <div class="data-row">
        <span class="label">Серия:</span>
        <span class="value">{{ passportData.series || '—' }}</span>
      </div>
      
      <div class="data-row">
        <span class="label">Номер:</span>
        <span class="value">{{ passportData.number || '—' }}</span>
      </div>
      
      <div class="data-row">
        <span class="label">Дата выдачи:</span>
        <span class="value">{{ formatDate(passportData.date_of_issue) }}</span>
      </div>
      
      <div class="data-row">
        <span class="label">Код подразделения:</span>
        <span class="value">{{ passportData.unit_code || '—' }}</span>
      </div>
      
      <div class="data-row">
        <span class="label">Кем выдан:</span>
        <span class="value">{{ passportData.issued_by_whom || '—' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { defineProps } from 'vue';

export default {
  name: 'PassportDataView',
  props: {
    passportData: {
      type: Object,
      default: null
    }
  },
  setup(props) {
    const formatDate = (dateString) => {
      if (!dateString) return '—';
      return new Date(dateString).toLocaleDateString('ru-RU');
    };

    return {
      formatDate
    };
  }
};
</script>

<style scoped>
.passport-data-view {
  padding: 20px;
  min-width: 300px;
}

.data-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.data-row {
  display: flex;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}

.label {
  flex: 0 0 120px;
  font-weight: 600;
  color: #666;
}

.value {
  flex: 1;
  color: #333;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 20px;
}
</style>