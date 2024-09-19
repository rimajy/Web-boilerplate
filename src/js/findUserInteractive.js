import fs from 'fs';
import readline from 'readline';

function findUsers(users, value) {
    return users.filter(user => {
        return Object.keys(user).some(key => {
            // Перевірка вкладених об'єктів, як-от coordinates або timezone
            if (typeof user[key] === 'object' && user[key] !== null) {
                return Object.values(user[key]).some(innerValue =>
                    innerValue.toString().toLowerCase().includes(value.toLowerCase())
                );
            }

            // Основна перевірка для полів
            return user[key].toString().toLowerCase().includes(value.toLowerCase());
        });
    });
}

// Зчитування параметрів з командного рядка
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Функція для отримання параметра від користувача
function getSearchValue(callback) {
    rl.question('Enter search value: ', (value) => {
        callback(value);
    });
}

// Функція для зчитування даних з файлу та пошуку користувачів
function readFileAndFind(filePath, searchValue) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        // Парсинг JSON
        const users = JSON.parse(data);

        // Пошук користувачів по будь-якому полі
        const foundUsers = findUsers(users, searchValue);

        // Вивід знайдених користувачів
        console.log('Found Users:');
        console.log(foundUsers);
    });
}

// Головна функція
function main() {
    getSearchValue((searchValue) => {
        readFileAndFind('formattedUsers.json', searchValue);
    });
}

main();
