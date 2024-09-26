let teachers = [];  // Масив для зберігання викладачів
let selectedTeacher = null;  // Змінна для вибраного викладача
let currentPage = 1; // Номер поточної сторінки
const itemsPerPage = 10; // Кількість вчителів на сторінці
let totalPages = 0; // Загальна кількість сторінок

document.addEventListener("DOMContentLoaded", function() {
  fetchTeachers();
});

document.getElementById('filter-button').addEventListener('click', filterTeachers);

function fetchTeachers() {
    fetch('formattedUsers.json')  // Змінити на правильний шлях до JSON-файлу
        .then(response => response.json())
        .then(data => {
            teachers = data;  // Зберігаємо завантажених викладачів
            displayTeachers(teachers);  // Відображаємо всіх викладачів
            fetchFavoriteTeachers(teachers); // Відображаємо улюблених викладачів
            displayStatistics(teachers); // Відображаємо статистику
        })
        .catch(error => console.error('Error fetching teachers:', error));  // Обробка помилок
}

function fetchFavoriteTeachers(allTeachers) {
    const favoriteTeachers = allTeachers.filter(teacher => teacher.favorite === "yes");
    displayFavoriteTeachers(favoriteTeachers);
}

function displayTeachers(teachers) {
    const teachersList = document.getElementById('teachers-list');
    teachersList.innerHTML = '';  // Очищення списку

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

function filterTeachers() {
    const age = document.getElementById('agef').value;
    const country = document.getElementById('region').value;
    const gender = document.getElementById('genderf').value;
    const photo = document.getElementById('photo').checked;
    const favorite = document.getElementById('favorite').checked;

    const filters = {
        age: age ? parseInt(age, 10) : null,
        country: country || null,
        gender: gender || null,
        favorite: favorite ? "yes" : null,
        hasPhoto: photo
    };

    const filteredTeachers = filterUsers(teachers, filters);
    displayTeachers(filteredTeachers);
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

// Обробник події для кнопки "Save Teacher"
document.getElementById('save-teacher').addEventListener('click', function() {
    const newTeacher = {
        id: teachers.length + 1, // Генерація унікального id
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
        favorite: 'no' // Можна додати логіку для улюбленого викладача
    };

    // Додавання нового викладача до масиву
    teachers.push(newTeacher);

    // Закриття модального вікна
    document.getElementById('add-teacher-modal').style.display = 'none';

    // Оновлення списку викладачів на сторінці
    updateTeacherList();
});

// Функція для закриття модального вікна
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
        selectedTeacher.favorite = selectedTeacher.favorite === 'yes' ? 'no' : 'yes';
        const star = document.getElementById('favorite-star');
        star.classList.toggle('favorite', selectedTeacher.favorite === 'yes');

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
    const tbody = document.querySelector('.statistics tbody');
    tbody.innerHTML = ''; // Очищення таблиці

    // Обчисліть загальну кількість сторінок
    totalPages = Math.ceil(teachers.length / itemsPerPage);

    // Визначте, які вчителі показувати на поточній сторінці
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentTeachers = teachers.slice(startIndex, endIndex);

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
}
