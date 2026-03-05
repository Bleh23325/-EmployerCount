<template>
  <div class="registration-address-view">
    <div v-if="!addressData" class="no-data">
      <p>Адрес регистрации отсутствует</p>
    </div>
    
    <div v-else class="address-grid">
      <div class="address-row">
        <span class="label">Регион:</span>
        <span class="value">{{ addressData.region || '—' }}</span>
      </div>
      
      <div class="address-row">
        <span class="label">Населенный пункт:</span>
        <span class="value">{{ addressData.locality || '—' }}</span>
      </div>
      
      <div class="address-row">
        <span class="label">Улица:</span>
        <span class="value">{{ addressData.street || '—' }}</span>
      </div>
      
      <div class="address-row">
        <span class="label">Дом:</span>
        <span class="value">{{ addressData.house || '—' }}</span>
      </div>
      
      <div class="address-row" v-if="addressData.building">
        <span class="label">Корпус/строение:</span>
        <span class="value">{{ addressData.building }}</span>
      </div>
      
      <div class="address-row" v-if="addressData.apartament">
        <span class="label">Квартира:</span>
        <span class="value">{{ addressData.apartament }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'RegistrationAddressView',
  props: {
    addressData: {
      type: Object,
      default: null
    }
  }
};
</script>

<style scoped>
.registration-address-view {
  padding: 20px;
  min-width: 300px;
}

.address-grid {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.address-row {
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