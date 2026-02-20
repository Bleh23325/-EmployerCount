### ЦВЕТОВАЯ ПАЛИТРА ПРОЕКТА
--primary: #e67e22;        /* Оранжевый - основной */
--secondary: #9b59b6;      /* Фиолетовый - второстепенный */
--accent: rgba(0,212,255,0.63); /* Голубой - акцентный */
--error: #e74c3c;          /* Красный - ошибка */
--success: #2ecc71;        /* Зеленый - успех */

### КАК ИСПОЛЬЗОВАЬТ КОМПОНЕНТЫ
1. Block
Блок с белым фоном и тенью, разделяет страницу на логические части.
Пишется под все элементы

2. Input
Ввод текста

Пропты: (пропт, тип, по умолчанию, описание)
placeholder --	String --	'' --	Текст-подсказка
required --	Boolean --	false --	Обязательное поле
error --	Boolean --	false --	Состояние ошибки
success --	Boolean --	false --	Состояние успеха


<!-- Обычный инпут -->
<Input placeholder="Введите текст"/>

<!-- Обязательное поле -->
<Input required placeholder="Имя"/>

<!-- С ошибкой -->
<Input error placeholder="Неверный формат"/>

<!-- С успехом -->
<Input success placeholder="Верный ввод"/>

3. Button
Кнопки. у нас разделяются по цветам и по активности

Пропты: (пропт, тип, по умолчанию, описание)
variant --	String --	'primary' --	primary, secondary, accent
size --	String --	'medium' --	small, medium, large
outline --	Boolean --	false --	Контурная кнопка
disabled --	Boolean --	false --	Неактивная кнопка

<Button variant="primary">Оранжевая</Button>
<Button variant="secondary">Фиолетовая</Button>
<Button variant="accent">Голубая</Button>
<!-- Неактивная -->
<Button disabled>Недоступно</Button>

4. Checkbox
Там где ставят галочки

Пропты: (пропт, тип, по умолчанию, описание)
v-model --	Boolean --	false --	Состояние чекбокса
color --	String --	'secondary' --	primary, secondary, accent
error --	Boolean --	false --	Состояние ошибки
disabled --	Boolean --	false --	Неактивный

<!-- Обычный чекбокс -->
<Checkbox v-model="agree">Согласен с условиями</Checkbox>

<!-- Разные цвета -->
<Checkbox color="primary">Основной цвет</Checkbox>
<Checkbox color="accent">Голубой</Checkbox>

<!-- Состояния -->
<Checkbox disabled>Неактивный</Checkbox>
<Checkbox error>Ошибка</Checkbox>

<!-- Группа чекбоксов -->
<Checkbox v-model="options.opt1">Вариант 1</Checkbox>
<Checkbox v-model="options.opt2">Вариант 2</Checkbox>

5. Modal
модельное окно

Пропты: (пропт, тип, по умолчанию, описание)

v-model:show --	Boolean --	false --	Видимость окна
title	-- String --	'Модальное окно'	-- Заголовок
closeOnClickOverlay -- 	Boolean --	true --	Закрытие по клику вне окна

<Modal 
    v-model:show="showModal"
    title="Заголовок"
    size="medium"
>
    <p>Контент модального окна</p>
    
    <template #footer>
        <Button @click="showModal = false">Отмена</Button>
        <Button @click="save">Сохранить</Button>
    </template>
</Modal>

6. selector
Выпадающий список

Пропты: (пропт, тип, по умолчанию, описание)

v-model --	String/Number --	'' --	Выбранное значение
options --	Array --	required --	Массив {value, label}
label --	String --	'' --	Заголовок поля
placeholder --	String --	'Выберите вариант' --	Текст-подсказка
disabled --	Boolean --	false --	Неактивный

### КАК ЗАПУСТИТЬ ГОТОВЫЙ VUE ПРОЕКТ
1. клонируем репозиторий
git clone git@github.com:Bleh23325/-EmployerCount.git

2. дальше вручную переходим в папку -EmployerCount

3. Открываем там консоль (удобнее открыть папку в vs code и там открыть консоль)

4. Устанавливаем зависимости
npm i

5. Запускаем в резиме разработки
npm run dev

6. после запуска появится сторка с ссылкой на localhost. зажимаем ctrl и кликаем на нее
