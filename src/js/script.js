let teachers = [];  // Масив для зберігання викладачів
let selectedTeacher = null;  // Змінна для вибраного викладача
let currentPage = 1; // Номер поточної сторінки
let totalPages = 0; // Загальна кількість сторінок
let displayedTeachers = 0; // Відображені викладачі
const itemsPerPage = 10; // Кількість викладачів на сторінці
let index = 0; // Ініціалізація індексу з 0

document.addEventListener("DOMContentLoaded", function() {
    fetchTeachers();
    document.getElementById('more-button').addEventListener('click', loadMoreTeachers);
});

document.getElementById('filter-button').addEventListener('click', filterTeachers);

async function fetchTeachers() {
    try {
        // Отримуємо 10 викладачів через API
        const newTeachers = await getUsers(); // Викликаємо функцію для отримання користувачів
        teachers.push(...newTeachers); // Додаємо нових викладачів до масиву
        displayTeachers(teachers.slice(0, displayedTeachers + itemsPerPage));  // Відображаємо нових викладачів
        displayedTeachers += itemsPerPage; // Оновлюємо відображені викладачі
        totalPages = Math.ceil(teachers.length / itemsPerPage); // Оновлюємо загальну кількість сторінок
        fetchFavoriteTeachers(teachers); // Відображаємо улюблених викладачів
        displayStatistics(teachers); // Відображаємо статистику
    } catch (error) {
        console.error('Error fetching teachers:', error); // Обробка помилок
    }
}
async function loadMoreTeachers() {
    // Якщо відображених викладачів менше загальної кількості викладачів, відображаємо їх
    if (displayedTeachers < teachers.length) {
        const nextTeachers = teachers.slice(displayedTeachers, displayedTeachers + itemsPerPage);
        displayTeachers(nextTeachers);
        displayedTeachers += itemsPerPage; // Оновлюємо відображені викладачі
    } else {
        // Якщо викладачі закінчились, запитуємо ще 10
        await fetchTeachers();
        loadMoreTeachers(); // Викликаємо знову, щоб відобразити нових викладачів
    }
}



// Викликаємо функцію для отримання викладачів
function fetchFavoriteTeachers(allTeachers) {
    const favoriteTeachers = allTeachers.filter(teacher => teacher.favorite === true);
    displayFavoriteTeachers(favoriteTeachers);
}


function displayTeachers(teachers) {
    const teachersList = document.getElementById('teachers-list');
    teachersList.innerHTML = '';  // Очищення списку перед відображенням нових даних

    // Перевірка, чи є викладачі після фільтрації
    if (teachers.length === 0) {
        teachersList.innerHTML = '<p>Нічого не знайдено за вашими запитами.</p>';
        return;
    }
    teachers.forEach(teacher => {
        const [firstName, lastName] = teacher.full_name.split(' ');

        const teacherCard = `
    <div class="teacher-card-container" onclick="openInfModal(${teacher.id})">
        <div class="teacher-card">
            <img src="${teacher.picture_large}" alt="${teacher.full_name}">
        </div>
        <h3>${firstName}<br>${lastName}</h3>
        <p>${teacher.course}<br>${teacher.country}</p>
    </div>
`;
        teachersList.innerHTML += teacherCard;
    });
}
const filters = {
    age: null,
    country: null,
    gender: null,
    favorite: null,
    hasPhoto: false
};
function filterTeachers() {
    const age = document.getElementById('agef').value;
    const country = document.getElementById('region').value;
    const gender = document.getElementById('genderf').value;
    const photo = document.getElementById('photo').checked;
    const favorite = document.getElementById('favorite').checked;

    // Зберігаємо фільтри
    filters.age = age ? parseInt(age, 10) : null;
    filters.country = country || null;
    filters.gender = gender || null;
    filters.favorite = favorite ? true : null;
    filters.hasPhoto = photo;

    const filteredTeachers = filterUsers(teachers, filters);
    displayTeachers(filteredTeachers);
    displayStatistics(filteredTeachers);
}

function openInfModal(id) {
    selectedTeacher = teachers.find(teacher => teacher.id === id);
    const teacherInfo = document.getElementById('teacher-info');
    teacherInfo.innerHTML = `
        <div style="display: flex; align-items: flex-start;">
            <img src="${selectedTeacher.picture_large}" alt="${selectedTeacher.full_name}" style="width: 100px; height: auto; margin-right: 20px;">
            <div>
                <h2>${selectedTeacher.full_name}</h2>
                <p><strong>Course:</strong> ${selectedTeacher.course}</p>
                <p><strong>Country:</strong> ${selectedTeacher.country}</p>
                <p><strong>City:</strong> ${selectedTeacher.city}, ${selectedTeacher.state}</p>
                <p><strong>Email:</strong> ${selectedTeacher.email}</p>
                <p><strong>Phone:</strong> ${selectedTeacher.phone}</p>
                <p><strong>Age:</strong> ${selectedTeacher.age}</p>
                <p><strong>Note:</strong> ${selectedTeacher.note}</p>
                <p>
                    <strong>Favorite Color:</strong> 
                    <span class="color-square" style="background-color: ${selectedTeacher.bg_color};"></span>
                </p>
            </div>
        </div>
    `;

    const star = document.getElementById('favorite-star');
    star.classList.toggle('favorite', selectedTeacher.favorite === 'yes');

    document.getElementById('teacher-modal').style.display = 'block';
}

document.querySelectorAll('.add-teacher').forEach(button => {
    button.addEventListener('click', function() {
        const teacherId = parseInt(this.getAttribute('data-id'), 10);
        openAddModal(teacherId);
    });
});

// Функція для відкриття модального вікна
function openAddModal() {
    // Очищення полів форми перед відображенням
    document.getElementById('full_name').value = '';
    document.getElementById('course').value = '';
    document.getElementById('country').value = '';
    document.getElementById('city').value = '';
    document.getElementById('gender').value = '';
    document.getElementById('email').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('age').value = '';
    document.getElementById('note').value = '';
    document.getElementById('bg_color').value = '#ffcc00';

    // Відображення модального вікна
    document.getElementById('add-teacher-modal').style.display = 'block';
}
function validateTeacherData(teacher) {
    const { full_name, age, email, phone, country } = teacher;

    if (!full_name || !age || !email || !phone || !country) {
        alert("Будь ласка, заповніть усі поля.");
        return false;
    }

    if (isNaN(age) || age <= 0 || age > 100) {
        alert("Вік повинен бути числом від 1 до 100.");
        return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert("Будь ласка, введіть дійсну електронну пошту.");
        return false;
    }


    return true; // Якщо всі перевірки пройдені
}
// Обробник події для кнопки "Save Teacher"
document.getElementById('save-teacher').addEventListener('click', function() {
    const newTeacher = {
        id: index + 1, // Генерація унікального id
        full_name: document.getElementById('full_name').value,
        course: document.getElementById('course').value,
        country: document.getElementById('country').value,
        city: document.getElementById('city').value,
        gender: document.getElementById('gender').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        age: parseInt(document.getElementById('age').value),
        note: document.getElementById('note').value,
        bg_color: document.getElementById('bg_color').value,
        favorite: false // Можна додати логіку для улюбленого викладача
    };

    const isValid = validateTeacherData(newTeacher);
    console.log(isValid); // Додайте цей рядок для перевірки результату валідації

    // Додавання нового викладача до масиву
    if (isValid) {
        teachers.push(newTeacher);
        // Закриття модального вікна
        document.getElementById('add-teacher-modal').style.display = 'none';

        // Оновлення списку викладачів на сторінці
        updateTeacherList();

        // Оновлення статистики
        displayStatistics(teachers); // Оновлення статистики після додавання нового викладача
    } else {
        alert("Введені дані не є валідними. Будь ласка, перевірте їх."); // Повідомлення про помилку
    }
});



document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('add-teacher-modal').style.display = 'none';
});

// Функція для оновлення списку викладачів
function updateTeacherList() {
    const teachersList = document.getElementById('teachers-list');
    teachersList.innerHTML = ''; // Очищення списку

    teachers.forEach(teacher => {
        const [firstName, lastName] = teacher.full_name.split(' ');

        const teacherCard = `
    <div class="teacher-card-container" onclick="openInfModal(${teacher.id})">
        <div class="teacher-card">
            <img src="${teacher.picture_large}" alt="${teacher.full_name}">
        </div>
        <h3>${firstName}<br>${lastName}</h3>
        <p>${teacher.course}<br>${teacher.country}</p>
    </div>
`;
        teachersList.innerHTML += teacherCard;
    });
}

function closeModal() {
    document.getElementById('teacher-modal').style.display = 'none';
}

function toggleFavorite() {
    if (selectedTeacher) {
        selectedTeacher.favorite = selectedTeacher.favorite === true ? false : true;
        const star = document.getElementById('favorite-star');
        star.classList.toggle('favorite', selectedTeacher.favorite === true);

        // Оновлюємо список викладачів та улюблених
        displayTeachers(teachers);
        fetchFavoriteTeachers(teachers);
    }
}

function displayFavoriteTeachers(favoriteTeachers) {
    const favoritesList = document.getElementById('favorites-list');
    favoritesList.innerHTML = '';

    favoriteTeachers.forEach(teacher => {
        const [firstName, lastName] = teacher.full_name.split(' ');

        const favoriteCard = `
            <div class="teacher-card-container" onclick="openInfModal(${teacher.id})">
                <div class="teacher-card">
                    <img src="${teacher.picture_large}" alt="${teacher.full_name}">
                </div>
                <h3>${firstName}<br>${lastName}</h3>
                <p>${teacher.course}<br>${teacher.country}</p>
            </div>
        `;
        favoritesList.innerHTML += favoriteCard;
    });
}
function displayStatistics(teachers) {
    const filteredTeachers = filterUsers(teachers, filters); // Фільтруємо викладачів
    const tbody = document.querySelector('.statistics tbody');
    tbody.innerHTML = ''; // Очищення таблиці

    // Обчисліть загальну кількість сторінок
    totalPages = Math.ceil(filteredTeachers.length / itemsPerPage);

    // Визначте, які вчителі показувати на поточній сторінці
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTeachers = filteredTeachers.slice(startIndex, endIndex);

    // Відобразіть вчителів на поточній сторінці
    currentTeachers.forEach(teacher => {
        const row = `
            <tr>
                <td>${teacher.full_name}</td>
                <td>${teacher.course}</td>
                <td>${teacher.age || teacher.age1}</td>
                <td>${teacher.gender}</td>
                <td>${teacher.country}</td>
            </tr>
        `;
        tbody.innerHTML += row;
    });

    // Оновіть навігаційні кнопки
    updatePagination();
}

function updatePagination() {
    const pageLinks = document.querySelectorAll('.page-link');
    pageLinks.forEach(link => link.style.display = 'none'); // Сховати всі посилання

    // Відобразити відповідні сторінки
    for (let i = 1; i <= totalPages; i++) {
        const link = document.getElementById(`page-${i}`);
        if (link) {
            link.style.display = 'inline'; // Показати сторінку
            link.classList.remove('active'); // Видалити клас активної сторінки
        }
    }

    // Встановити активну сторінку
    const currentLink = document.getElementById(`page-${currentPage}`);
    if (currentLink) {
        currentLink.classList.add('active'); // Додати клас активної сторінки
    }

    // Визначити видимість кнопок "Previous" і "Next"
    document.getElementById('prev-page').style.display = currentPage > 1 ? 'inline' : 'none';
    document.getElementById('next-page').style.display = currentPage < totalPages ? 'inline' : 'none';
}
document.getElementById('prev-page').addEventListener('click', function(event) {
    event.preventDefault();
    if (currentPage > 1) {
        currentPage--;
        displayStatistics(teachers);
    }
});

document.getElementById('next-page').addEventListener('click', function(event) {
    event.preventDefault();
    if (currentPage < totalPages) {
        currentPage++;
        displayStatistics(teachers);
    }
});

// Обробники для чисел сторінок
document.querySelectorAll('.page-link').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        currentPage = parseInt(this.dataset.page);
        displayStatistics(teachers);
    });
});

function searchTeachers() {
    const searchInput = document.getElementById('search').value.toLowerCase(); // Отримуємо введене значення
    const filteredTeachers = teachers.filter(teacher => {
        // Пошук по ім'ю, коментарю та віку
        return (
            teacher.full_name.toLowerCase().includes(searchInput) ||
            teacher.note.toLowerCase().includes(searchInput) ||
            (teacher.age && teacher.age.toString().includes(searchInput)) // Перевірка на вік
        );
    });

    displayTeachers(filteredTeachers); // Відображаємо знайдених викладачів
    displayStatistics(filteredTeachers);
}
const getRandomCourse = () => {
    const courses = [
        "Mathematics", "Physics", "English", "Computer Science",
        "Dancing", "Chess", "Biology", "Chemistry",
        "Law", "Art", "Medicine", "Statistics"
    ];
    return courses[Math.floor(Math.random() * courses.length)];
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
// Основна функція для отримання 50 користувачів
const getUsers = async () => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 секунд тайм-аут

        const response = await fetch('https://randomuser.me/api/?results=50', {
            signal: controller.signal
        });

        clearTimeout(timeoutId); // Очищення тайм-ауту, якщо запит завершився успішно

        const data = await response.json();
        const users = data.results;

        // Форматуємо дані користувачів
        const formattedUsers = users.map((user) => {
            return {
                id: index++, // Унікальний ідентифікатор, що починається з 0
                gender: user.gender || "",
                title: user.name?.title || "",
                full_name: `${user.name?.first || ""} ${user.name?.last || ""}`,
                city: user.location?.city || "",
                state: user.location?.state || "",
                country: user.location?.country || "",
                postcode: user.location?.postcode || "",
                coordinates: {
                    latitude: user.location?.coordinates?.latitude || "",
                    longitude: user.location?.coordinates?.longitude || ""
                },
                timezone: {
                    offset: user.location?.timezone?.offset || "",
                    description: user.location?.timezone?.description || ""
                },
                email: user.email || "",
                b_date: user.dob?.date || "",
                age: user.dob?.age || "",
                phone: user.phone || "",
                picture_large: user.picture?.large || "",
                picture_thumbnail: user.picture?.thumbnail || "",
                favorite: Math.random() > 0.5, // Випадковий boolean
                course: getRandomCourse(), // Випадковий курс
                bg_color: getRandomColor(), // Випадковий колір
                note: "", // Порожнє поле для записів
            };
        });

        return formattedUsers; // Повертаємо відформатований масив користувачів
    } catch (error) {
        console.error('Error fetching users:', error);
    }
};

// Виклик функції для отримання користувачів
getUsers().then(users => {
    console.log(users); // Виводимо отримані дані в консоль
});
