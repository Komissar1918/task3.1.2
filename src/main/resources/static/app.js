
document.addEventListener("DOMContentLoaded", async () => {
    const userTableId = document.getElementById('usersTableBody');
    const authUser = document.getElementById('auth-user-info');
    const authUserTable = document.getElementById('authUserTableBody');
    const createUserButton = document.getElementById('create-user-button');
    const editId = document.getElementById('edit-id');
    const editName = document.getElementById('edit-name');
    const editSurname = document.getElementById('edit-surname');
    const editAge = document.getElementById('edit-age');
    const editEmail = document.getElementById('edit-email');
    const editPassword = document.getElementById('edit-password');
    const editRole = document.getElementById('edit-role');
    const editModal = document.getElementById('edit-modal');
    const editCloseButton = document.getElementById('edit-close-button');
    const editSubmitButton = document.getElementById('edit-submit-button');
    const deleteID = document.getElementById('deleteFormId');
    const deleteName = document.getElementById('deleteFormName');
    const deleteSurname = document.getElementById('deleteFormSurname');
    const deleteAge = document.getElementById('deleteFormAge');
    const deleteEmail = document.getElementById('deleteFormEmail');
    const deleteRole = document.getElementById('deleteFormRole');
    const deleteModal = document.getElementById('deleteModal');
    const deleteSubmitButton = document.getElementById('delete-submit');


    fetch('http://localhost:8080/admin/users')
        .then(response => response.json())
        .then(users => {
            // Распарсим JSON-строку в объект JavaScript
            displayUsers(users)
        })
        .catch(error => console.error(error));

    fetch('http://localhost:8080/user/show')
        .then(response => response.json())
        .then(user => {
            // Распарсим JSON-строку в объект JavaScript
            console.log('/user get')
            displayUser(user);
        })        .catch(error => console.error(error));

    function displayUsers(users) {
        authUser.textContent = users[users.length - 1].email + ' with roles ' + users[users.length - 1].roles.map(role => role.name.replaceAll('ROLE_', '')).join(', ');
        userTableId.innerHTML = '';

        for(let i = 0; i < users.length - 1; i++) {
            const userDiv = document.createElement('tr');
            userDiv.innerHTML = `<td>${users[i].id}</td><td>${users[i].name}</td><td>${users[i].surname}</td><td>${users[i].age}</td><td>${users[i].email}</td>
                <td>${users[i].roles.map(role => role.name.replaceAll('ROLE_', '')).join(', ')}</td>
                <td><button id="edit-user-button" type="button" class="btn btn-primary" data-bs-toggle="modal" data-target="#edit-modal" data-user-id="${users[i].id}">Edit
                                    </button></td> <td><button id="delete-user-button" type="button" class="btn btn-danger" data-bs-toggle="modal" data-target="#deleteModal"
                                    data-user-id="${users[i].id}">Delete
                                    </button></td>`;

            userTableId.appendChild(userDiv);

        }
        const editButtons = userTableId.querySelectorAll('[data-user-id]');
        for (let i = 0; i < editButtons.length; i++) {
            editButtons[i].addEventListener('click', () => {
                openEditModal(editButtons[i].getAttribute('data-user-id'));
            });
        }

        const deleteButtons = userTableId.querySelectorAll('[data-user-id]');
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].addEventListener('click', () => {
                openDeleteModal(deleteButtons[i].getAttribute('data-user-id'));
            });
        }

    }

    function displayUser(user) {
        authUserTable.innerHTML = '';
        const userDiv = document.createElement('tr');
        userDiv.innerHTML = `<td>${user.id}</td><td>${user.name}</td><td>${user.surname}</td><td>${user.age}</td><td>${user.email}</td>
               <td>${user.roles.map(role => role.name.replaceAll('ROLE_', '')).join(', ')}</td>`;
        authUserTable.appendChild(userDiv);
    }

    function openEditModal(id) {
        // Найти пользователя по id
        fetch(`http://localhost:8080/admin/${id}`)
            .then(response => response.json())
            .then(user => {
                // Заполнить поля модального окна данными пользователя
                editId.value = user.id;
                editName.value = user.name;
                editSurname.value = user.surname;
                editAge.value = user.age;
                editEmail.value = user.email;
                editPassword.value = user.password;
                editRole.value = user.roles.map(role => role.name);
                // Открыть модальное окно
                editModal.style.display = 'block';
                editSubmitButton.addEventListener('submit', () => editUser(id));
            })
            .catch(error => console.error(error));
    }

    function editUser(id) {
        const name = editName.value;
        const surname = editSurname.value;
        const age = editAge.value;
        const email = editEmail.value;
        const password = editPassword.value;
        const role = editRole.value;

        fetch('http://localhost:8080/admin/edit/${id}', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },  body: JSON.stringify({ name, surname, age, email, password, role })
        })
            .then(response => response.json())
            .then(updatedUser => {
                console.log(`Updated user with id ${updatedUser.id}`);
                fetch('http://localhost:8080/admin')
                    .then(response => response.json())
                    .then(users => {
                        displayUsers(users);
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.log(error));
    }

    function openDeleteModal(id) {
        // Найти пользователя по id
        fetch(`http://localhost:8080/admin/${id}`)
            .then(response => response.json())
            .then(user => {
                // Заполнить поля модального окна данными пользователя
                deleteID.value = user.id;
                deleteName.value = user.name;
                deleteSurname.value = user.surname;
                deleteAge.value = user.age;
                deleteEmail.value = user.email;
                deleteRole.value = user.roles.map(role => role.name);
                // Открыть модальное окно
                deleteModal.style.display = 'block';
                deleteSubmitButton.addEventListener('click', () => deleteUser(id));
            })
            .catch(error => console.error(error));
    }


    function deleteUser(id) {
        fetch(`http://localhost:8080/admin/delete/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                console.log(`Deleted user with id ${id}`);
                fetch('http://localhost:8080/admin/users')
                    .then(response => response.json())
                    .then(users => {
                        displayUsers(users);
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.log(error));
    }
    // function deleteUser(id) {
    //     fetch('http://localhost:8080/admin/delete/{id}', {
    //         method: 'DELETE',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //
    //     })
    //         .catch(error => console.error(error));
    // }



    createUserButton.addEventListener('click', () => {
        const createName = document.getElementById('create-name');
        const createSurname = document.getElementById('create-surname');
        const createAge = document.getElementById('create-age');
        const createEmail = document.getElementById('create-email');
        const createPassword = document.getElementById('create-password');
        const createRole = document.getElementById('create-role');

        const name = createName.value;
        const surname = createSurname.value;
        const age = createAge.value;
        const email = createEmail.value;
        const password = createPassword.value;
        const role = createRole.value;

        fetch('http://localhost:8080/saveUser', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, surname, age, email, password, role })
        })
            .then(response => response.json())
            .then(user => {
                console.log(`Created user with id ${user.id}`);
                createName.value = '';
                createSurname.value = '';
                createAge.value = '';
                createEmail.value = '';
                createPassword.value = '';
                createRole.value = '';
                fetch('http://localhost:8080/admin/users')
                    .then(response => response.json())
                    .then(users => {
                        displayUsers(users);
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.log(error));
    });
});








