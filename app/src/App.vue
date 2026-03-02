<template>
    <Block>
        <h1>Учет сотрудников</h1>
        <p>это пример и потом это удалится, так что сделайте копию!</p>
    </Block>
    <Block>
        это блок окторый надо прописывать под каждый элементом, он разделяет логисекие части
    </Block>
    <Block>
        <div class="baseVert">
            пример инпута
            <Input  placeholder="Введите свой текст"/>
            пример инпута который обязательный
            <Input required  placeholder="Введите свой текст"/>
            пример инпута c ошибкой
            <Input error  placeholder="Введите свой текст"/>
            пример инпута верный ввод
            <Input success  placeholder="Введите свой текст"/>
        </div>
    </Block>
    <Block>
        туткнопки
        <div class="baseVert">
            активные обычные кнопки
            <div class = "baseGoriz">
                <Button variant="primary">кнопка первичной важности</Button>
                <Button variant="secondary">кнопка вторичной важности</Button>
                <Button variant="accent">кнопка нетакуся</Button>
            </div>
            неактивные такие же кнопки, те выключенные (так можно со всеми кнопками)
            <div class = baseGoriz>
                <Button disabled>если не прописать вариант кнопка будет оранжевая</Button>
                <Button variant="secondary" disabled>Неактивная кнопка</Button>
            </div>
        </div>
    </Block>
    <Block>
        чекбоксы
        <div class="baseVert">
            <h5>обычные</h5>
            <Checkbox v-model="agree">Согласен с условиями</Checkbox>
            <Checkbox v-model="newsletter">Получать новости</Checkbox>
        </div>
        <div class="baseVert">
            <h5>разные цвета</h5>
            <div class="horizontal-group">
                <Checkbox color="primary">Основной цвет</Checkbox>
                <Checkbox color="secondary">Фиолетовый</Checkbox>
                <Checkbox color="accent">Голубой</Checkbox>
            </div>
        </div>
        <div class="baseVert">
            <h5>состояния</h5>
            <div class="vertical-group">
                <Checkbox disabled>Неактивный</Checkbox>
                <Checkbox disabled checked>Неактивный выбранный</Checkbox>
                <Checkbox error>С ошибкой</Checkbox>
            </div>
        </div>
        <div class="baseVert">
            <h5>связанные (выбрать что то)</h5>
            <div class="vertical-group">
                <Checkbox v-model="vibori.v1">выбор 1</Checkbox>
                <Checkbox v-model="vibori.v2">выбор 2</Checkbox>
                <Checkbox v-model="vibori.v3">выбор 3</Checkbox>
            </div>
            <p style="margin-top: 20px;">
                Выбрано: 
                {{ Object.entries(vibori).filter(([_, v]) => v).map(([k]) => k).join(', ') }}
            </p>
        </div>
    </Block>
    <Block>
        Модальные окна
        <div class="baseGoriz">
            <Button @click="showModal = true">Открыть модальное окно</Button>
            <Button variant="secondary" @click="showFormModal = true">Форма в модалке</Button>
        </div>
        <Modal 
            v-model:show="showModal"
            title="Информация"
        >
            <p>Это простое модальное окно с информацией.</p>
            <p>Кликните вне окна или нажмите крестик, чтобы закрыть.</p>
        </Modal>
        <Modal 
            v-model:show="showFormModal"
            title="Добавить сотрудника"
        >
            <div style="display: flex; flex-direction: column; gap: 15px;">
                <Input placeholder="Имя сотрудника"/>
                <Input placeholder="Должность"/>
                <Input placeholder="Отдел"/>
            </div>
            
            <template #footer>
                <Button variant="secondary" @click="showFormModal = false">Отмена</Button>
                <Button @click="saveEmployee">Сохранить</Button>
            </template>
        </Modal>
    </Block>
    <Block>
        Selector
        <div class="baseVert">
            <Selector 
                v-model="selectedDepartment"
                :options="departments"
                label="Выберите отдел"
                placeholder="-- Выберите отдел --"
            />
                
            <p>Выбрано: {{ selectedDepartment || 'ничего' }}</p>
        </div>
        несколько селекторов
        <div class="baseGoriz">
            <Selector 
                v-model="selectedRole"
                :options="roles"
                label="Должность"
                placeholder="-- Выберите --"
            />
                
            <Selector 
                v-model="selectedCity"
                :options="cities"
                label="Город"
                placeholder="-- Выберите --"
            />
        </div>
        связанные селекторы
        <div class="baseVert">
            <Selector 
                v-model="selectedCountry"
                :options="countries"
                label="Страна"
                placeholder="-- Выберите страну --"
            />
                
            <Selector 
                v-model="selectedCity"
                :options="filteredCities"
                label="Город"
                placeholder="-- Сначала выберите страну --"
                :disabled="!selectedCountry"
            />
        </div>
    </Block>
    <Block>
        <div baseVert>
            а вот этот код демонстрирует как привязывать кастомные уведомления к кнопкам или куда там надо
            <div baseGoriz>
                <Button @click="showSuccess">Успех</Button>
                <Button variant="secondary" @click="showError">ошибка</Button>
                <Button @click="showWarning">предупреждение</Button>
                <Button variant="accent" @click="showInfo">информация</Button>
            </div>
            <div baseGoriz>
                <Button @click="showLongMessage">Длинное сообщение</Button>
                <Button @click="showNoDuration">Без автозакрытия</Button>
                <Button @click="clearAll">закрыть все уведомления</Button>
            </div>
        </div>
    </Block>
    <Block title="Примеры в действии">
        <div class="baseVert">
            <Button @click="saveEmployee">Сохранить сотрудника</Button>
            <Button variant="secondary" @click="deleteEmployee">Удалить сотрудника</Button>
        </div>
    </Block>
</template>

<script>
import Input from './components/ui/UiInput.vue'
import Button from './components/ui/UiButton.vue'
import Block from './components/ui/UiBlock.vue'
import Checkbox from './components/ui/UiCheckbox.vue'
import Modal from './components/ui/UiModal.vue'
import Selector from './components/ui/UiSelector.vue'

export default{
    components:{
        Button,
        Input,
        Checkbox,
        Selector,
        Block,
        Modal
    },
    data(){
        return{
             // Для первого примера селектора
            selectedDepartment: '',
            departments: [
                { value: 'it', label: 'IT отдел' },
                { value: 'hr', label: 'HR отдел' },
                { value: 'finance', label: 'Финансовый отдел' },
                { value: 'marketing', label: 'Маркетинг' }
            ],
            
            // Для второго примера селектора
            selectedRole: '',
            roles: [
                { value: 'dev', label: 'Разработчик' },
                { value: 'designer', label: 'Дизайнер' },
                { value: 'manager', label: 'Менеджер' }
            ],
            
            selectedCity: '',
            cities: [
                { value: 'msk', label: 'Москва' },
                { value: 'spb', label: 'Санкт-Петербург' },
                { value: 'kazan', label: 'Казань' }
            ],
            
            // Для связанных селекторов селекторов
            selectedCountry: '',
            countries: [
                { value: 'ru', label: 'Россия' },
                { value: 'us', label: 'США' },
                { value: 'eu', label: 'Европа' }
            ],

            showModal: false,
            showFormModal: false,

            agree:false,
            newsletter:true,
            vibori:{
                v1:true,
                v2:false,
                v3:false
            }
        }
    },
     methods: {
        saveEmployee() {
            alert('Сотрудник сохранен!')
            this.showFormModal = false
        },
        //дальше уведомления

        showSuccess() {
            this.$notify.success(
                'Успешно!',
                'Данные сохранены',
                3000
            )
        },
        
        showError() {
            this.$notify.error(
                'Ошибка!',
                'Не удалось сохранить данные',
                5000
            )
        },
        
        showWarning() {
            this.$notify.warning(
                'Предупреждение',
                'Заполните обязательные поля',
                4000
            )
        },
        
        showInfo() {
            this.$notify.info(
                'Информация',
                'Всего сотрудников: 42',
                3000
            )
        },
        
        showLongMessage() {
            this.$notify.info(
                'Длинное уведомление',
                'Это очень длинное сообщение, которое показывает, как наше уведомление адаптируется под контент и переносит текст',
                6000
            )
        },
        
        showNoDuration() {
            this.$notify.warning(
                'Внимание!',
                'Это уведомление не закроется автоматически, нажмите крестик',
                0
            )
        },
        
        clearAll() {
            this.$notify.clear()
        },
        
        saveEmployee() {
            // Имитация сохранения
            setTimeout(() => {
                this.$notify.success(
                    'Сотрудник сохранен',
                    'Данные успешно добавлены в базу',
                    3000
                )
            }, 1000)
        },
        
        deleteEmployee() {
            // Имитация удаления с ошибкой
            setTimeout(() => {
                this.$notify.error(
                    'Ошибка удаления',
                    'Невозможно удалить сотрудника с активными задачами',
                    5000
                )
            }, 1000)
        }
    },
    computed: {
        filteredCities() {
            if (!this.selectedCountry) return []
            
            const citiesByCountry = {
                ru: [
                    { value: 'msk', label: 'Москва' },
                    { value: 'spb', label: 'Санкт-Петербург' },
                    { value: 'kazan', label: 'Казань' }
                ],
                us: [
                    { value: 'ny', label: 'Нью-Йорк' },
                    { value: 'la', label: 'Лос-Анджелес' },
                    { value: 'chi', label: 'Чикаго' }
                ],
                eu: [
                    { value: 'paris', label: 'Париж' },
                    { value: 'berlin', label: 'Берлин' },
                    { value: 'rome', label: 'Рим' }
                ]
            }
            
            return citiesByCountry[this.selectedCountry] || []
        }
    }
}
</script>
<style scoped>
.baseVert{
    display: flex;
    text-align: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    gap:20px;
    flex-wrap: wrap;
}
.baseGoriz{
    display: flex;
    gap:20px;
    flex-direction: row;
    justify-content: center;
    flex-wrap: wrap;
    text-align: center;
}
</style>