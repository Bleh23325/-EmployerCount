<template>
    <Teleport to="body">
        <div v-if="show" class="modal-overlay" @click.self="close">
            <div class="modal">
                <div class="modal__header">
                    <h3 class="modal__title">{{ title }}</h3>
                    <button class="modal__close" @click="close">✕</button>
                </div>
                
                <div class="modal__content">
                    <slot></slot>
                </div>
                
                <div class="modal__footer">
                    <slot name="footer">
                        <Button @click="close">Закрыть</Button>
                    </slot>
                </div>
            </div>
        </div>
    </Teleport>
</template>

<script>
import Button from './UiButton.vue'

export default {
    name: 'UiModal',
    components: {
        Button
    },
    props: {
        show: {
            type: Boolean,
            default: false
        },
        title: {
            type: String,
            default: 'Модальное окно'
        }
    },
    emits: ['update:show', 'close'],
    methods: {
        close() {
            this.$emit('update:show', false)
            this.$emit('close')
        }
    }
}
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
}

.modal {
    background: white;
    border-radius: 8px;
    min-width: 400px;
    max-width: 90%;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.modal__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
    border-bottom: 1px solid #eee;
}

.modal__title {
    margin: 0;
    color: #333;
}

.modal__close {
    background: none;
    border: none;
    font-size: 20px;
    cursor: pointer;
    color: #999;
    transition: color 300ms ease;
}

.modal__close:hover {
    color: #e67e22;
}

.modal__content {
    padding: 20px;
}

.modal__footer {
    padding: 20px;
    border-top: 1px solid #eee;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
}
</style>