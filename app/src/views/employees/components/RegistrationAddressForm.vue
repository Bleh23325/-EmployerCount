<template>
  <Block title="Адрес регистрации">
    <div class="baseGoriz">
      <!-- Регион -->
      <div class="baseVert">
        <label>Регион <span class="required">*</span></label>
        <Input
          v-model="localAddress.region"
          :error="errors.region"
          placeholder="Край, область, республика"
        />
      </div>

      <!-- Населенный пункт -->
      <div class="baseVert">
        <label>Населенный пункт <span class="required">*</span></label>
        <Input
          v-model="localAddress.locality"
          :error="errors.locality"
          placeholder="Город, поселок, село"
        />
      </div>

      <!-- Улица -->
      <div class="baseVert">
        <label>Улица <span class="required">*</span></label>
        <Input
          v-model="localAddress.street"
          :error="errors.street"
          placeholder="Улица"
        />
      </div>

      <!-- Дом -->
      <div class="baseVert">
        <label>Дом <span class="required">*</span></label>
        <Input
          v-model="localAddress.house"
          :error="errors.house"
          placeholder="123"
        />
      </div>

      <!-- Корпус -->
      <div class="baseVert">
        <label>Корпус/строение</label>
        <Input
          v-model="localAddress.building"
          :error="errors.building"
          placeholder="2"
        />
      </div>

      <!-- Квартира -->
      <div class="baseVert">
        <label>Квартира</label>
        <Input
          v-model="localAddress.apartament"
          :error="errors.apartament"
          placeholder="45"
        />
      </div>
    </div>
  </Block>
</template>

<script>
import { ref, watch } from 'vue';
import { Block, Input } from '@/components/index';

export default {
  name: 'RegistrationAddressForm',
  components: {
    Block,
    Input
  },
  props: {
    modelValue: {
      type: Object,
      default: () => ({})
    },
    errors: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['update:modelValue', 'validate'],
  setup(props, { emit }) {
    const localAddress = ref({
      region: props.modelValue.region || '',
      locality: props.modelValue.locality || '',
      street: props.modelValue.street || '',
      house: props.modelValue.house || '',
      building: props.modelValue.building || '',
      apartament: props.modelValue.apartament || ''
    });

    watch(localAddress, (newValue) => {
      emit('update:modelValue', newValue);
      emit('validate');
    }, { deep: true });

    return {
      localAddress
    };
  }
};
</script>

<style scoped>

label {
  display: block;
  margin-bottom: 5px;
  font-weight: 500;
  color: #333;
}

.required {
  color: #d32f2f;
}
</style>