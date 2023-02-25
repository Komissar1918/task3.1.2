document.addEventListener("DOMContentLoaded", async () => {

    const authUser = document.getElementById('auth-user-info');
    const authUserTable = document.getElementById('authUserTableBody');

    const editId = document.getElementById('edit-id');
    const editName = document.getElementById('edit-name');
    const editSurname = document.getElementById('edit-surname');
    const editAge = document.getElementById('edit-age');
    const editEmail = document.getElementById('edit-email');
    const editPassword = document.getElementById('edit-password');
    const editRole = document.getElementById('edit-role');
    const editCloseButton = document.getElementById('edit-close-button');

    const deleteID = document.getElementById('deleteFormId');
    const deleteName = document.getElementById('deleteFormName');
    const deleteSurname = document.getElementById('deleteFormSurname');
    const deleteAge = document.getElementById('deleteFormAge');
    const deleteEmail = document.getElementById('deleteFormEmail');
    const deleteRole = document.getElementById('deleteFormRole');
    const deleteSubmitButton = document.getElementById('delete-submit');




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
            deleteBtn.innerHTML = `<button type="button" class="btn btn-danger">Delete</button>`;

            //editBtn.addEventListener("click", () => openEditModal(users[i].id));
            //deleteBtn.addEventListener("click", () => openDeleteModal(users[i].id))
            userEl.append(editBtn);
            userEl.append(deleteBtn);
            userTableId.appendChild(userEl);

            // const newUserHeader = document.getElementById("nav-profile-tab");
            // newUserHeader.addEventListener("click", getAllRoles)
        }
    }




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
                let formSelect = document.getElementById("edit-role");
                const respRoles = await fetch('http://localhost:8080/admin/roles/', {
                    headers: {
                        "Content-Type": "application/json"
                    }
                });
                const respRolesData = await respRoles.json();

                for (let i = 0; i < respRolesData.length; i++) {
                    // formSelect.options[respRolesData[i] + 1].selected = 1;
                    formSelect.value = respRolesData[i] + 1;
                }
                // Открыть модальное окно
                let myModal = new bootstrap.Modal(document.getElementById('edit-modal'));
                myModal.show();
                let editSubmitButton = document.getElementById('edit-submit-button');
                editSubmitButton.addEventListener('click', () => editUser(id));
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
        let formselect = document.getElementById("edit-role");

        const roles = [];

        for (let i = 0; i < formselect.options.length; i++) {
            if (formselect.options[i].selected) {
                let role = {id: 0, name: ""}
                role.id = i + 1;
                role.name = formselect.options[i].value;
                roles.push(role);
            }
        }


        fetch(`http://localhost:8080/admin/edit/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            }, body: JSON.stringify({name, surname,email, age, password, roles})
        })
            .then(response => response.json())
            .then(updatedUser => {
                //console.log(`Updated user with id ${updatedUser.id}`);
                fetch('http://localhost:8080/admin')
                    .then(response => response.json())
                    .then(users => {
                        displayUsers(users);
                    })
                    .catch(error => console.error(error));
            })
            .catch(error => console.log(error));
    }


});








