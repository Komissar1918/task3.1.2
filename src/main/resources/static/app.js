const editId    = document.getElementById('edit-id');
const editName = document.getElementById('edit-name');
const editSurname = document.getElementById('edit-surname');
const editAge = document.getElementById('edit-age');
const editEmail = document.getElementById('edit-email');
const editPassword = document.getElementById('edit-password');
const editRole = document.getElementById('edit-role');
const editCloseButton = document.getElementById('edit-close-button');
const editSubmitButton = document.getElementById('edit-submit-button');
const editModal = document.getElementById('edit-modal');

document.addEventListener("DOMContentLoaded", async () => {
    const userTableId = document.getElementById('usersTableBody');


    function displayUsers(users) {
        userTableId.innerHTML = '';
        users.forEach(user => {
            const userDiv = document.createElement('tr');
            userDiv.innerHTML = `<td>${user.id}</td><td>${user.name}</td><td>${user.surname}</td><td>${user.age}</td><td>${user.email}</td>
                <td>${user.roles.map(role => role.name).join(', ')}</td>
                <td><button onclick="editUser(${user.id})" id="edit-user-button" type="button" class="btn btn-primary" data-bs-toggle="modal">Edit
                                    </button></td> <td><button type="button" class="btn btn-danger" data-bs-toggle="modal">Delete
                                    </button></td>`;
            userTableId.appendChild(userDiv);
        });
    }



// Запрос для получения списка пользователей
    fetch('http://localhost:8080/admin')
        .then(response => response.json())
        .then(users => {
            // Распарсим JSON-строку в объект JavaScript
            displayUsers(users)
        })
        .catch(error => console.error(error));

// Событие отправки формы для добавления нового пользователя
    userTableEdit.addEventListener('submit', (event) => {
        editUser(editUserId)
        event.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const age = document.getElementById('age').value;

        // Запрос для создания нового пользователя
        fetch('http://localhost:8080/saveUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, age })
        })
            .then(response => response.json())
            .then(newUser => {
                console.log(`Created user with id ${newUser.id}`);
                // Обновляем список пользователей
                fetch('http://localhost:8080/admin')
                    .then(response => response.json())
                    .then(users => {
                        displayUsers(users);
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.error(error));
    });


    function createUser(user) {
        fetch('http://localhost:8080/saveUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })
            .then(response => response.json())
            .then(newUser => {
                console.log(`Created user with id ${newUser.id}`);
                displayUsers(users);
            })
            .catch(error => console.error(error));
    }

    function updateUser(id, updatedUser) {
        fetch(`http://localhost:8080/admin/edit/${id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedUser)
        })
            .then(response => response.json())
            .then(updatedUser => {
                console.log(`Updated user with id ${updatedUser.id}`);
                displayUsers()
            })
            .catch(error => console.error(error));
    }

    function deleteUser(id) {
        fetch(`http://localhost:8080/admin/delete/${id}`, {
            method: 'DELETE'
        })
            .then(() => {
                console.log(`Deleted user with id ${id}`);
                displayUsers();
            })
            .catch(error => console.error(error));
    }
});

function editUser(id) {
    const user = { id, name, surname, email };

    fetch('http://localhost:8080/admin/edit/${id}', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },  body: JSON.stringify(user)
    })
        .then(response => response.json())
        .then(user => {
            editId.value = user.id;
            editName.value = user.name;
            editSurname.value = user.surname;
            editAge.value = user.age;
            editEmail.value = user.email;
            editPassword.value = user.password;
            editRole.value = user.roles.map(role => role.name).join(', ');
            editModal.style.display = "block";

        })
        .catch(error => console.log(error));
}

