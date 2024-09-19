import fs from 'fs';
import readline from 'readline';

function filterUsers(users, filters) {
    return users.filter(user => {
        return (
            (!filters.country || user.country.toLowerCase() === filters.country.toLowerCase()) &&
            (!filters.age || user.age === filters.age) &&
            (!filters.gender || user.gender.toLowerCase() === filters.gender.toLowerCase()) &&
            (!filters.favorite || user.favorite.toLowerCase() === filters.favorite.toLowerCase())
        );
    });
}

// Функція для зчитування даних з файлу
function readFileAndFilter(filePath, filters, callback) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        // Парсинг JSON
        const users = JSON.parse(data);

        // Фільтрація користувачів
        const filteredUsers = filterUsers(users, filters);

        // Виклик зворотного виклику з відфільтрованими користувачами
        callback(filteredUsers);
    });
}

// Зчитування параметрів фільтрації з командного рядка
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Функція для отримання параметрів від користувача
function getFilters(callback) {
    const filters = {};

    rl.question('Enter country (or leave empty): ', (country) => {
        if (country) filters.country = country.trim();

        rl.question('Enter age (or leave empty): ', (age) => {
            if (age) filters.age = parseInt(age, 10);

            rl.question('Enter gender (or leave empty): ', (gender) => {
                if (gender) filters.gender = gender.trim();

                rl.question('Enter favorite (or leave empty): ', (favorite) => {
                    if (favorite) filters.favorite = favorite.trim();

                    rl.close();
                    callback(filters);
                });
            });
        });
    });
}

// Головна функція
function main() {
    getFilters((filters) => {
        readFileAndFilter('formattedUsers.json', filters, (filteredUsers) => {
            console.log('Filtered Users:');
            console.log(filteredUsers);
        });
    });
}

main();

