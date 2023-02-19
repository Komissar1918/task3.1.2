package ru.itmentor.spring.boot_security.demo.dto;

import ru.itmentor.spring.boot_security.demo.models.Role;

import java.util.Set;

public class UserDTO {

    private String name;

    private String surname;

    private String password;

    private String email;

    private Set<Role> roles;



    public Set<Role> getRoles() {
        return roles;
    }

    public void setRoles(Set<Role> roles) {
        this.roles = roles;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
