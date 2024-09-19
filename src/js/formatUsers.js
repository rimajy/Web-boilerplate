// Імпорт даних з файлу
import { randomUserMock, additionalUsers } from './FE4U-Lab2-mock.js';
import fs from 'fs';
// Функція для створення рандомного курсу
const getRandomCourse = () => {
    const courses = [
        "Mathematics", "Physics", "English", "Computer Science",
        "Dancing", "Chess", "Biology", "Chemistry",
        "Law", "Art", "Medicine", "Statistics"
    ];
    return courses[Math.floor(Math.random() * courses.length)];
};
const generateRandomEmail = () => {
    const randomNumber = String(Math.floor(Math.random() * 999) + 1).padStart(3, '0');
    return `unknown.email${randomNumber}@example.com`;
};
// Генерація випадкового кольору для bg_color
const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
};

// Форматування об'єкта до необхідної структури
const formatUser = (user, id) => {
    return {
        id: id, // Унікальний ідентифікатор
        gender: user.gender || "",
        title: user.name?.title || user.title ||"",
        full_name: user.full_name || `${user.name?.first || ""} ${user.name?.last || ""}`,
        city: user.location?.city || user.city ||"",
        state:  user.location?.state || user.state ||"",
        country: user.location?.country || user.country ||"",
        postcode: user.location?.postcode || user.postcode || "",
        coordinates: {
            latitude: user.location?.coordinates?.latitude || "",
            longitude: user.location?.coordinates?.longitude || ""
        },
        timezone: {
            offset: user.location?.timezone?.offset || user.offset ||"",
            description: user.location?.timezone?.description || ""
        },
        email: user.email || generateRandomEmail(),
        b_date: user.dob?.date || user.b_day ||"",
        age: user.dob?.age || user.age ||"",
        phone: user.phone || "",
        picture_large: user.picture?.large || user.picture_large ||"",
        picture_thumbnail: user.picture?.thumbnail || user.picture_thumbnail ||"",
        favorite: Math.random() > 0.5, // Випадковий boolean
        course: getRandomCourse(), // Випадковий курс
        bg_color:user.color || getRandomColor(), // Випадковий колір
        note:user.note || "", // Порожнє поле для записів
    };
};

// Функція для генерації всіх користувачів з випадковими електронними адресами
const generateUsersWithRandomEmails = (users) => {
    return users.map(user => {
        if (!user.email) {
            user.email = generateRandomEmail();
        }
        return user;
    });
};

// Функція для об'єднання масивів та видалення повторів
const mergeUsers = (users1, users2) => {
    const allUsers = [...users1, ...users2];

    // Генерація випадкових email для всіх користувачів, якщо їх немає
    const usersWithEmails = generateUsersWithRandomEmails(allUsers);

    // Перевірка на унікальність за email
    const uniqueUsers = [];
    const emailSet = new Set();

    usersWithEmails.forEach(user => {
        if (!emailSet.has(user.email)) {
            emailSet.add(user.email);
            uniqueUsers.push(user);
        }
    });

    return uniqueUsers;
};

// Основна функція для отримання відформатованих користувачів
const getFormattedUsers = () => {
    // Поєднайте масиви та перевірте на дублікати
    const allUsers = mergeUsers(randomUserMock, additionalUsers);

    // Форматуйте кожного користувача
    return allUsers.map((user, index) => {
        console.log(`Processing user ${index + 1}:`, user); // Для налагодження
        return formatUser(user, index + 1);
    });
};

// Отримання відформатованих користувачів
const formattedUsers = getFormattedUsers();
console.log('Formatted Users:', formattedUsers);

// Збереження відформатованих користувачів у файл
fs.writeFile('formattedUsers.json', JSON.stringify(formattedUsers, null, 2), err => {
    if (err) {
        console.error('Error writing file:', err);
    } else {
        console.log('File has been saved!');
    }
});

export { getFormattedUsers };






