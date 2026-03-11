import { ref } from 'vue';

export function EmployeeValidation() {
  const errors = ref({});

  // Валидация всех данных сразу
  const validateAll = (data) => {
    // Очищаем ошибки
    errors.value = {};
    
    let isValid = true;
    
    // Валидация сотрудника
    if (!validateEmployee(data.employee)) {
      isValid = false;
    }
    
    // Валидация паспорта
    if (!validatePassportData(data.passport)) {
      isValid = false;
    }
    
    // Валидация адреса
    if (!validateAddress(data.address)) {
      isValid = false;
    }
    
    return isValid;
  };

  // Валидация основных данных сотрудника
  const validateEmployee = (employeeData) => {
    const newErrors = {};
    let isValid = true;
    
    // Проверка фамилии
    if (!employeeData.first_name || employeeData.first_name.trim() === '') {
      newErrors.first_name = 'Фамилия обязательна для заполнения';
      isValid = false;
    } else if (employeeData.first_name.length < 2) {
      newErrors.first_name = 'Фамилия должна содержать минимум 2 символа';
      isValid = false;
    } else if (employeeData.first_name.length > 50) {
      newErrors.first_name = 'Фамилия не может превышать 50 символов';
      isValid = false;
    } else if (!/^[а-яА-ЯёЁ\s-]+$/.test(employeeData.first_name)) {
      newErrors.first_name = 'Фамилия может содержать только буквы, пробелы и дефис';
      isValid = false;
    }

    // Проверка имени
    if (!employeeData.name || employeeData.name.trim() === '') {
      newErrors.name = 'Имя обязательно для заполнения';
      isValid = false;
    } else if (employeeData.name.length < 2) {
      newErrors.name = 'Имя должно содержать минимум 2 символа';
      isValid = false;
    } else if (employeeData.name.length > 50) {
      newErrors.name = 'Имя не может превышать 50 символов';
      isValid = false;
    } else if (!/^[а-яА-ЯёЁ\s-]+$/.test(employeeData.name)) {
      newErrors.name = 'Имя может содержать только буквы, пробелы и дефис';
      isValid = false;
    }

    // Проверка отчества (необязательное поле)
    if (employeeData.patronymic && employeeData.patronymic.length > 50) {
      newErrors.patronymic = 'Отчество не может превышать 50 символов';
      isValid = false;
    } else if (employeeData.patronymic && !/^[а-яА-ЯёЁ\s-]+$/.test(employeeData.patronymic)) {
      newErrors.patronymic = 'Отчество может содержать только буквы, пробелы и дефис';
      isValid = false;
    }

    // Проверка даты рождения
    if (!employeeData.date_of_birth) {
      newErrors.date_of_birth = 'Дата рождения обязательна';
      isValid = false;
    } else {
      const birthDate = new Date(employeeData.date_of_birth);
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 100);
      const maxDate = new Date();
      maxDate.setFullYear(today.getFullYear() - 16);

      if (birthDate > today) {
        newErrors.date_of_birth = 'Дата рождения не может быть в будущем';
        isValid = false;
      } else if (birthDate < minDate) {
        newErrors.date_of_birth = 'Возраст не может превышать 100 лет';
        isValid = false;
      } else if (birthDate > maxDate) {
        newErrors.date_of_birth = 'Сотрудник должен быть старше 16 лет';
        isValid = false;
      }
    }

    // Проверка организации
    if (!employeeData.id_organization || employeeData.id_organization === '') {
      newErrors.id_organization = 'Выберите организацию';
      isValid = false;
    }

    // Проверка отдела
    if (!employeeData.id_department || employeeData.id_department === '') {
      newErrors.id_department = 'Выберите отдел';
      isValid = false;
    }

    // Проверка должности
    if (!employeeData.id_position || employeeData.id_position === '') {
      newErrors.id_position = 'Выберите должность';
      isValid = false;
    }

    // Проверка оклада
    if (employeeData.setting_the_salary && employeeData.setting_the_salary !== '') {
      const salary = Number(employeeData.setting_the_salary);
      if (isNaN(salary) || salary < 0) {
        newErrors.setting_the_salary = 'Оклад не может быть отрицательным числом';
        isValid = false;
      }
    }

    // ошибки в общий объект
    errors.value = { ...errors.value, ...newErrors };
    return isValid;
  };

  // Валидация паспортных данных
  const validatePassportData = (passportData) => {
    const newErrors = {};
    let isValid = true;

    // Серия паспорта
    if (!passportData.series || passportData.series.trim() === '') {
      newErrors.series = 'Серия паспорта обязательна';
      isValid = false;
    } else if (!/^\d{4}$/.test(passportData.series)) {
      newErrors.series = 'Серия должна содержать 4 цифры';
      isValid = false;
    }

    // Номер паспорта
    if (!passportData.number || passportData.number.trim() === '') {
      newErrors.number = 'Номер паспорта обязателен';
      isValid = false;
    } else if (!/^\d{6}$/.test(passportData.number)) {
      newErrors.number = 'Номер должен содержать 6 цифр';
      isValid = false;
    }

    // Дата выдачи
    if (!passportData.date_of_issue) {
      newErrors.date_of_issue = 'Дата выдачи обязательна';
      isValid = false;
    } else {
      const issueDate = new Date(passportData.date_of_issue);
      const today = new Date();
      const minDate = new Date();
      minDate.setFullYear(today.getFullYear() - 20);

      if (issueDate > today) {
        newErrors.date_of_issue = 'Дата выдачи не может быть в будущем';
        isValid = false;
      } else if (issueDate < minDate) {
        newErrors.date_of_issue = 'Паспорт не может быть выдан более 20 лет назад';
        isValid = false;
      }
    }

    // Код подразделения
    if (!passportData.unit_code || passportData.unit_code.trim() === '') {
      newErrors.unit_code = 'Код подразделения обязателен';
      isValid = false;
    } else if (!/^\d{3}-\d{3}$/.test(passportData.unit_code)) {
      newErrors.unit_code = 'Код подразделения должен быть в формате 123-456';
      isValid = false;
    }

    // Кем выдан
    if (!passportData.issued_by_whom || passportData.issued_by_whom.trim() === '') {
      newErrors.issued_by_whom = 'Поле "Кем выдан" обязательно';
      isValid = false;
    } else if (passportData.issued_by_whom.length < 10) {
      newErrors.issued_by_whom = 'Слишком короткое название организации';
      isValid = false;
    } else if (passportData.issued_by_whom.length > 255) {
      newErrors.issued_by_whom = 'Слишком длинное название организации';
      isValid = false;
    }

    errors.value = { ...errors.value, ...newErrors };
    return isValid;
  };

  // Валидация адреса регистрации
  const validateAddress = (addressData) => {
    const newErrors = {};
    let isValid = true;

    // Регион
    if (!addressData.region || addressData.region.trim() === '') {
      newErrors.region = 'Регион обязателен';
      isValid = false;
    } else if (addressData.region.length < 3) {
      newErrors.region = 'Название региона слишком короткое';
      isValid = false;
    }

    // Населенный пункт
    if (!addressData.locality || addressData.locality.trim() === '') {
      newErrors.locality = 'Населенный пункт обязателен';
      isValid = false;
    } else if (addressData.locality.length < 2) {
      newErrors.locality = 'Название населенного пункта слишком короткое';
      isValid = false;
    }

    // Улица
    if (!addressData.street || addressData.street.trim() === '') {
      newErrors.street = 'Улица обязательна';
      isValid = false;
    } else if (addressData.street.length < 3) {
      newErrors.street = 'Название улицы слишком короткое';
      isValid = false;
    }

    // Дом
    if (!addressData.house || addressData.house.trim() === '') {
      newErrors.house = 'Номер дома обязателен';
      isValid = false;
    } else if (!/^\d+[а-яА-Я]?$/.test(addressData.house)) {
      newErrors.house = 'Номер дома должен быть в формате: 123, 123а';
      isValid = false;
    }

    // Квартира (необязательная)
    if (addressData.apartament && !/^\d+$/.test(addressData.apartament)) {
      newErrors.apartament = 'Номер квартиры должен содержать только цифры';
      isValid = false;
    }

    errors.value = { ...errors.value, ...newErrors };
    return isValid;
  };

  // Валидация файлов
  const validateFile = (file) => {
    const newErrors = {};
    let isValid = true;
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      newErrors.file = 'Допустимые форматы: JPEG, PNG, PDF';
      isValid = false;
    } else if (file.size > maxSize) {
      newErrors.file = 'Размер файла не должен превышать 5MB';
      isValid = false;
    }

    errors.value = { ...errors.value, ...newErrors };
    return isValid;
  };

  const clearErrors = () => {
    errors.value = {};
  };

  // Функция для получения всех сообщений об ошибках
  const getErrorMessages = () => {
    return Object.values(errors.value);
  };

  // Функция для получения первых 3 сообщений об ошибках (для краткого уведомления)
  const getFirstErrorMessages = (count = 3) => {
    const messages = Object.values(errors.value);
    return messages.slice(0, count);
  };

  // Функция для форматирования сообщений об ошибках в строку
  const formatErrorMessages = (maxMessages = 3) => {
    const messages = Object.values(errors.value);
    
    if (messages.length === 0) return '';
    
    if (messages.length <= maxMessages) {
      return messages.join('; ');
    } else {
      const firstMessages = messages.slice(0, maxMessages).join('; ');
      return `${firstMessages} и еще ${messages.length - maxMessages} ошибок`;
    }
  };

  return {
    errors,
    validateAll,
    validateEmployee,
    validatePassportData,
    validateAddress,
    validateFile,
    clearErrors,
    getErrorMessages,
    getFirstErrorMessages,
    formatErrorMessages
  };
}