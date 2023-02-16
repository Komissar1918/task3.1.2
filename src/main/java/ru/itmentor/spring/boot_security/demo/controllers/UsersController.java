package ru.itmentor.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.boot.Banner;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.itmentor.spring.boot_security.demo.models.Role;
import ru.itmentor.spring.boot_security.demo.models.User;
import ru.itmentor.spring.boot_security.demo.services.RoleService;
import ru.itmentor.spring.boot_security.demo.services.UserService;


import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@Controller
public class UsersController {

    private final UserService userService;
    private final RoleService roleService;

    @Autowired
    public UsersController(UserService userService, RoleService roleService) {
        this.userService = userService;
        this.roleService = roleService;
    }


    @GetMapping("/admin")
    public String getUsers(Model model) {
        List<User> users = userService.findAll();
        model.addAttribute("users", users);
        model.addAttribute("roles", roleService.getAllRoles());
        return "users";
    }

    @GetMapping("/user")
    public String userPageShow(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        return show(user.getId(), model);
    }

    @GetMapping("/{id}")
    public String show(@PathVariable("id") int id, Model model){
        model.addAttribute("user", userService.findUserById(id));

        return "show";
    }


    @GetMapping("/addNewUser")
    public String addNewUser(Model model) {
        model.addAttribute("user", new User());
        model.addAttribute("roles", roleService.getAllRoles());
        return "userInfo";
    }

    @PostMapping("/saveUser")
    public String saveUser(@ModelAttribute("user") User user,
                           @RequestParam(value = "selectedRoles", defaultValue = "1") ArrayList<Role> roles) {
        Set<Role> newUserRoles = new HashSet<>(roles);
        user.setRoles(newUserRoles);
        userService.saveUser(user);
        return "redirect:/admin";
    }

    @GetMapping("/{id}/edit")
    public String editUser(@PathVariable("id") int id, Model model) {
        model.addAttribute("user", userService.findUserById(id));
        model.addAttribute("roles", roleService.getAllRoles());
        return "edit";
    }

    @PatchMapping("admin/edit/{id}")
    public String updateUser(@ModelAttribute("user") User user,
                             @RequestParam(value = "selectedRoles", defaultValue = "1") ArrayList<Role> roles,
                             @PathVariable("id") int id) {

        if(roles != null) {
            Set<Role> setRoles = new HashSet<>(roles);
            user.setRoles(setRoles);
        } else {
            User editUserWithoutEditRoles = userService.findUserById(id);
            Set<Role> notEditRoles = editUserWithoutEditRoles.getRoles();
            user.setRoles(notEditRoles);
        }
        System.out.println(user);
        user.getRoles().forEach(System.out::println);
        userService.update(id, user);
        return "redirect:/admin";
    }

    @DeleteMapping("admin/{id}")
    public String deleteUser(@PathVariable("id") int id) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }



}