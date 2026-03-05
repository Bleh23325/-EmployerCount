export const validationRules = {
  // Валидация паспортных данных
  passportData: (data) => {
    const errors = [];
    
    if (data.series && !/^\d{4}$/.test(data.series)) {
      errors.push('Серия паспорта должна содержать 4 цифры');
    }
    
    if (data.number && !/^\d{6}$/.test(data.number)) {
      errors.push('Номер паспорта должен содержать 6 цифр');
    }
    
    if (data.date_of_issue) {
      const issueDate = new Date(data.date_of_issue);
      if (issueDate > new Date()) {
        errors.push('Дата выдачи не может быть в будущем');
      }
    }
    
    if (data.unit_code && !/^\d{3}-\d{3}$/.test(data.unit_code)) {
      errors.push('Код подразделения должен быть в формате 123-456');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Валидация адреса регистрации
  registrationAddress: (data) => {
    const errors = [];
    
    if (data.region && data.region.length < 2) {
      errors.push('Название региона должно содержать минимум 2 символа');
    }
    
    if (data.locality && data.locality.length < 2) {
      errors.push('Название населенного пункта должно содержать минимум 2 символа');
    }
    
    if (data.house && !/^\d+[а-яА-Я]?$/.test(data.house)) {
      errors.push('Номер дома должен быть в формате: 123, 123а');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Валидация файлов
  file: (file) => {
    const errors = [];
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (!allowedTypes.includes(file.type)) {
      errors.push('Допустимые форматы: JPEG, PNG, PDF');
    }
    
    if (file.size > maxSize) {
      errors.push('Размер файла не должен превышать 5MB');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }
};