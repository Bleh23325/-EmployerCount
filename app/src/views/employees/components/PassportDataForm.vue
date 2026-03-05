<template>
  <Block title="Паспортные данные">
    <div class="baseGoriz">
      <!-- Серия паспорта -->
      <div class="baseVert">
        <label>Серия паспорта <span class="required">*</span></label>
        <Input
          v-model="localPassportData.series"
          :error="errors.series"
          placeholder="1234"
          maxlength="4"
          @input="formatSeries"
        />
      </div>

      <!-- Номер паспорта -->
      <div class="baseVert">
        <label>Номер паспорта <span class="required">*</span></label>
        <Input
          v-model="localPassportData.number"
          :error="errors.number"
          placeholder="123456"
          maxlength="6"
          @input="formatNumber"
        />
      </div>

      <!-- Дата выдачи -->
      <div class="baseVert">
        <label>Дата выдачи <span class="required">*</span></label>
        <Input
          v-model="localPassportData.date_of_issue"
          type="date"
          :error="errors.date_of_issue"
          :max="today"
        />
      </div>

      <!-- Код подразделения -->
      <div class="baseVert">
        <label>Код подразделения <span class="required">*</span></label>
        <Input
          v-model="localPassportData.unit_code"
          :error="errors.unit_code"
          placeholder="123-456"
          maxlength="7"
          @input="formatUnitCode"
        />
      </div>

      <!-- Кем выдан -->
      <div class="baseVert ">
        <label>Кем выдан <span class="required">*</span></label>
        <Input
          v-model="localPassportData.issued_by_whom"
          :error="errors.issued_by_whom"
          placeholder="Наименование отделения УФМС"
        />
      </div>
    </div>
  </Block>
</template>

<script>
import { ref, watch } from 'vue';
import { Block, Input } from '@/components/index';

export default {
  name: 'PassportDataForm',
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
    const localPassportData = ref({
      series: props.modelValue.series || '',
      number: props.modelValue.number || '',
      date_of_issue: props.modelValue.date_of_issue || '',
      unit_code: props.modelValue.unit_code || '',
      issued_by_whom: props.modelValue.issued_by_whom || ''
    });

    const today = new Date().toISOString().split('T')[0];

    // Форматирование серии (только цифры)
    const formatSeries = (e) => {
      localPassportData.value.series = e.target.value.replace(/\D/g, '');
    };

    // Форматирование номера (только цифры)
    const formatNumber = (e) => {
      localPassportData.value.number = e.target.value.replace(/\D/g, '');
    };

    // Форматирование кода подразделения
    const formatUnitCode = (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length >= 3) {
        value = value.slice(0, 3) + '-' + value.slice(3, 6);
      }
      localPassportData.value.unit_code = value;
    };

    // Отслеживаем изменения и отправляем родителю
    watch(localPassportData, (newValue) => {
      emit('update:modelValue', newValue);
      emit('validate');
    }, { deep: true });

    return {
      localPassportData,
      today,
      formatSeries,
      formatNumber,
      formatUnitCode
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