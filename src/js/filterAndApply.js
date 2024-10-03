function filterUsers(users, filters) {
    return users.filter(user => {
        return (
            (!filters.country || user.country.toLowerCase() === filters.country.toLowerCase()) &&
            (!filters.age || user.age === filters.age) &&
            (!filters.gender || user.gender.toLowerCase() === filters.gender.toLowerCase()) &&
            (!filters.favorite || user.favorite === true) && // Перевірка наявності улюбленого
            (!filters.hasPhoto || user.picture_large)  // Перевірка наявності фото
        );
    });
}

