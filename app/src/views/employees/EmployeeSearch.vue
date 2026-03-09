<template>
    <div class="baseVert">
        <div class="baseGoriz">
            <Input 
                ref="searchInput"
                :value="modelValue"
                @input="onInput"
                @keydown.esc="clearSearch"
                :placeholder="placeholder">
            </Input>
        </div>
    </div>
    <div v-if="showResults && modelValue" class="baseGoriz">
        <slot name="results" :count="resultCount">
            Найдено: {{ resultCount }}
            {{ pluralize(resultCount,['сотрудник', 'сотрудника', 'сотрудников']) }}
        </slot>
    </div>
</template>

<script>
import { ref } from 'vue';
import {Input, Button} from '@/components/index';

export default {
    name: 'EmployeeSearch',
    components:{
        Input
    },
    props: {
        modelValue: {
            type: String,
            default: ''
        },
        placeholder: {
            type: String,
            default: 'Поиск по ФИО, должности, отделу'
        },
        showResults: {
            type: Boolean,
            default: true
        },
        resultCount: {
            type: Number,
            default: 0
        }
    },
    emits: ['update:modelValue', 'search', 'clear'],
    setup(props, { emit }) {
        const searchInput = ref(null);

        const onInput = (event) => {
            const value = event.target.value;
            emit('update:modelValue', value);
            emit('search', value);
        };

        const clearSearch = () => {
            emit('update:modelValue', '');
            emit('search', '');
            emit('clear');
            searchInput.value?.focus();
        };

        const pluralize = (count, words) => {
            const cases = [2, 0, 1, 1, 1, 2];
            return words[
                count % 100 > 4 && count % 100 < 20 
                    ? 2 
                    : cases[Math.min(count % 10, 5)]
            ];
        };

        return {
            searchInput,
            onInput,
            clearSearch,
            pluralize
        };
    }
};
</script>
