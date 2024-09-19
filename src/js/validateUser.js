import fs from 'fs';

// Функція перевірки валідності полів об'єкта
function validateField(value, type, pattern) {
    if (type === 'string') {
        return typeof value === 'string' && (pattern ? pattern.test(value) : true);
    }
    if (type === 'number') {
        return typeof value === 'number';
    }
    if (type === 'object') {
        return typeof value === 'object' && value !== null;
    }
    return false;
}


const phonePattern = /^(?:\d{9}|\d{2}-\d{3}-\d{3}|\d{8})$/;

function validateUser(user) {
    const namePattern = /^[A-Z][a-z]* [A-Z][a-z]*$/;
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return {
        full_name: validateField(user.full_name, 'string', namePattern),
        gender: validateField(user.gender, 'string', /^[A-Z][a-z]*$/),
        note: validateField(user.note, 'string',          /^[A-Z][a-z]*$/),
        state: validateField(user.state, 'string', /^[A-Z][a-z]*$/),
        city: validateField(user.city, 'string', /^[A-Z][a-z]*$/),
        country: validateField(user.country, 'string', /^[A-Z][a-z]*$/),
        postcode: validateField(user.postcode, 'number'),
        age: validateField(user.age, 'number'),
        email: validateField(user.email, 'string', emailPattern),
        phone: validateField(user.phone, 'string', phonePattern),
    };
}

// Зчитування файлу
fs.readFile('formattedUsers.json', 'utf8', (err, data) => {
    if (err) {
        console.error('Error reading file:', err);
        return;
    }

    const users = JSON.parse(data);

    users.forEach(user => {
        const validationResult = validateUser(user);
        console.log(`ID: ${user.id}`);
        console.log(`Full Name: ${user.full_name} - ${validationResult.full_name}`);
        console.log(`Gender: ${user.gender} - ${validationResult.gender}`);
        console.log(`Note: ${user.note} - ${validationResult.note}`);
        console.log(`State: ${user.state} - ${validationResult.state}`);
        console.log(`City: ${user.city} - ${validationResult.city}`);
        console.log(`Country: ${user.country} - ${validationResult.country}`);
        console.log(`Age: ${user.age} - ${validationResult.age}`);
        console.log(`Email: ${user.email} - ${validationResult.email}`);
        console.log(`Phone: ${user.phone} - ${validationResult.phone}`);
        console.log('-------------------------------------');
    });
});


