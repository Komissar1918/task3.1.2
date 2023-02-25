$(document).ready ( function () {
    let respRolesData = null;
    let formSelectCreate = document.getElementById("newUserRole");
    $.ajax({url: "http://localhost:8080/admin/roles/", success: function(result){
            respRolesData =  result;
            formSelectCreate.innerHTML = '';
            for (let i = 0; i < respRolesData.length; i++) {
                formSelectCreate.append(new Option( respRolesData[i].name, respRolesData[i].id));
                console.log(respRolesData[i]);
            }
        }});



    fetch('http://localhost:8080/admin/users')
        .then(response => response.json())
        .then(users => {
            // Распарсим JSON-строку в объект JavaScript
            displayUsers(users);
            //editModal.style.display = 'block';


        })
        .catch(error => console.error(error));

    fetch('http://localhost:8080/user/show')
        .then(response => response.json())
        .then(user => {
            // Распарсим JSON-строку в объект JavaScript
            console.log('/user get')
            displayUser(user);
        }).catch(error => console.error(error));



        $(document).on ("click", ".edit-btn", function () {
        const id = $(this).data("id")
        openEditModal(id);

    });

    $(document).on ("click", "#edit-submit-button", function () {
        const id = $(this).data("id")
        editUser(id);

    });

    $(document).on ("click", ".delete-btn", function () {
        const id = $(this).data("id")
        // alert(id);
       openDeleteModal(id);

    });

    $(document).on ("click", "#delete-submit", function () {
        const id = $(this).data("id")
        // alert(id);
        deleteUser(id);

    });

    const authUser = document.getElementById('auth-user-info');
    const authUserTable = document.getElementById('authUserTableBody');
    const editId = document.getElementById('edit-id');
    const editName = document.getElementById('edit-name');
    const editSurname = document.getElementById('edit-surname');
    const editAge = document.getElementById('edit-age');
    const editEmail = document.getElementById('edit-email');
    const editPassword = document.getElementById('edit-password');
    let myModal = new bootstrap.Modal(document.getElementById('edit-modal'));
    let myDeleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    const deleteID = document.getElementById('deleteFormId');
    const deleteName = document.getElementById('deleteFormName');
    const deleteSurname = document.getElementById('deleteFormSurname');
    const deleteAge = document.getElementById('deleteFormAge');
    const deleteEmail = document.getElementById('deleteFormEmail');
    const deleteRole = document.getElementById('deleteFormRole');
    let formSelect = document.getElementById("edit-role");



    function openEditModal(id) {
        // Найти пользователя по id
        fetch(`http://localhost:8080/admin/${id}`)
            .then(response => response.json())
            .then(async user => {
                // Заполнить поля модального окна данными пользователя
                editId.value = user.id;
                editName.value = user.name;
                editSurname.value = user.surname;
                editAge.value = user.age;
                editEmail.value = user.email;
                editPassword.value = user.password;
                console.log(user.roles);


                formSelect.innerHTML = '';
                for (let i = 0; i < respRolesData.length; i++) {
                    let bool = false;
                    user.roles.map(role => {
                        if(role.name === respRolesData[i].name) bool = true
                    });
                    formSelect.append(new Option(respRolesData[i].name, respRolesData[i].id, false, bool));
                    console.log(respRolesData[i]);
                }


                // Открыть модальное окно

                myModal.show();
                //let editSubmitButton = document.getElementById('edit-submit-button');
                $("#edit-submit-button").data("id", editId.value);
            })
            .catch(error => console.error(error));
    }

    function editUser(id) {
        console.log(id);
        const name = editName.value;
        const surname = editSurname.value;
        const age = editAge.value;
        const email = editEmail.value;
        const password = editPassword.value;
        let roles = [];
        for (let i = 0; i < formSelect.length; i++) {
            if (formSelect[i].selected) {
                let role = {id: 0, name: ""}
                role.id = i + 1;
                role.name = respRolesData[i].name;
                roles.push(role);
            }
        }
        console.log(name, surname, age, email, password, roles);
        console.log(JSON.stringify({name, surname,email, age, password, roles}))

        fetch(`http://localhost:8080/admin/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({name, surname,email, age, password, roles})
        })
            .then(response => response.json())
            .then(updatedUser => {
                console.log(`Updated user with id ${updatedUser.id}`);
                fetch('http://localhost:8080/admin/users')
                    .then(response => response.json())
                    .then(users => {
                        displayUsers(users);
                        myModal.hide();
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.log(error));
    }

    function displayUsers(users) {
        authUser.textContent = users[users.length - 1].email + ' with roles ' + users[users.length - 1].roles.map(role => role.name.replaceAll('ROLE_', '')).join(', ');
        const userTableId = document.querySelector(".usersTableBody");
        userTableId.innerHTML = "";

        for (let i = 0; i < users.length - 1; i++) {
            const userEl = document.createElement("tr");
            const editBtn = document.createElement("td");
            const deleteBtn = document.createElement("td");

            userEl.innerHTML = `
                    <td><p>${users[i].id}</td><td>${users[i].name}</p></td>
                    <td><p>${users[i].surname}</p></td>
                    <td><p>${users[i].age}</p></td>
                    <td><p>${users[i].email}</p></td>
                    <td><p>${users[i].roles.map(role => role.name.replaceAll('ROLE_', '')).join(', ')}</p></td>`;
            editBtn.innerHTML = `<button data-id="${users[i].id}" type="button" class="btn btn-primary edit-btn" >Edit</button>`;
            deleteBtn.innerHTML = `<button data-id="${users[i].id}" type="button" class="btn btn-danger delete-btn">Delete</button>`;

            userEl.append(editBtn);
            userEl.append(deleteBtn);
            userTableId.appendChild(userEl);

            // const newUserHeader = document.getElementById("nav-profile-tab");
            // newUserHeader.addEventListener("click", getAllRoles)
        }
    }
    function displayUser(user) {
        authUserTable.innerHTML = '';
        const userDiv = document.createElement('tr');
        userDiv.innerHTML = `<td>${user.id}</td><td>${user.name}</td><td>${user.surname}</td><td>${user.age}</td><td>${user.email}</td>
               <td>${user.roles.map(role => role.name.replaceAll('ROLE_', '')).join(', ')}</td>`;
        authUserTable.appendChild(userDiv);
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
                deleteRole.value = user.roles.map(role => role.name.replaceAll('ROLE_', '')).join(', ');
                // Открыть модальное окно

                myDeleteModal.show();
                $("#delete-submit").data("id", id);
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

                        myDeleteModal.hide();
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.log(error));
    }


    let createUserButton = document.getElementById('create-user-button');

    createUserButton.addEventListener('click', async () => {
        const createName = document.getElementById('name');
        const createSurname = document.getElementById('surname');
        const createAge = document.getElementById('age');
        const createEmail = document.getElementById('email');
        const createPassword = document.getElementById('password');


        // for (let i = 0; i < respRolesData.length; i++) {
        //     formSelectCreate.value = respRolesData[i] + 1;
        // }

        const name = createName.value;
        const surname = createSurname.value;
        const age = createAge.value;
        const email = createEmail.value;
        const password = createPassword.value;
        let roles = [];

        for (let i = 0; i < formSelectCreate.length; i++) {
            if (formSelectCreate[i].selected) {
                let role = {id: 0, name: ""}
                role.id = i + 1;
                role.name = respRolesData[i].name;
                roles.push(role);
            }
        }
        console.log(name, surname, age, email, password, roles);
        console.log(JSON.stringify({name, surname,email, age, password, roles}))

        fetch('http://localhost:8080/saveUser', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, surname, age, email, password, roles})
        })
            .then(response => response.json())
            .then(user => {
                console.log(`Created user with email ${user.email}`);
                createName.value = '';
                createSurname.value = '';
                createAge.value = '';
                createEmail.value = '';
                createPassword.value = '';
                formSelectCreate.value = '';
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

