import fs from 'fs';
import readline from 'readline';

function sortUsers(users, sortBy, order = '>') {
    return users.slice().sort((a, b) => {
        if (!a.hasOwnProperty(sortBy) || !b.hasOwnProperty(sortBy)) {
            throw new Error(`Invalid sort parameter: ${sortBy}`);
        }

        const aValue = typeof a[sortBy] === 'string' ? a[sortBy].toLowerCase() : a[sortBy];
        const bValue = typeof b[sortBy] === 'string' ? b[sortBy].toLowerCase() : b[sortBy];

        let comparison = 0;

        if (aValue > bValue) {
            comparison = 1;
        } else if (aValue < bValue) {
            comparison = -1;
        }

        return order === '<' ? -comparison : comparison;
    });
}

// Зчитування параметрів з командного рядка
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// Функція для отримання параметрів від користувача
function getParameters(callback) {
    const parameters = {};

    rl.question('Enter sort parameter (full_name, age, country): ', (sortBy) => {
        parameters.sortBy = sortBy.trim();

        rl.question('Enter sort order (asc for ascending, desc for descending): ', (order) => {
            parameters.order = order.trim().toLowerCase();

            rl.close();
            callback(parameters);
        });
    });
}

// Функція для зчитування даних з файлу та сортування користувачів
function readFileAndSort(filePath, parameters) {
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return;
        }

        // Парсинг JSON
        const users = JSON.parse(data);

        // Сортування користувачів
        try {
            const sortedUsers = sortUsers(users, parameters.sortBy, parameters.order);

            // Вивід відсортованих користувачів
            console.log('Sorted Users:');
            console.log(sortedUsers);
        } catch (error) {
            console.error('Error during sorting:', error.message);
        }
    });
}

// Головна функція
function main() {
    getParameters((parameters) => {
        readFileAndSort('formattedUsers.json', parameters);
    });
}

main();
