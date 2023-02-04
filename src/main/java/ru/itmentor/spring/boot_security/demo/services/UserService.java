package ru.itmentor.spring.boot_security.demo.services;


import ru.itmentor.spring.boot_security.demo.models.User;

import java.util.List;

public interface UserService {
    List<User> findAll();
    void save(User user);
    User findOne(Integer id);
    void update(Integer id, User user);
    public void delete(Integer id);
}
