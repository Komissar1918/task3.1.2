package ru.itmentor.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.itmentor.spring.boot_security.demo.models.Role;
import ru.itmentor.spring.boot_security.demo.models.User;
import ru.itmentor.spring.boot_security.demo.services.UserService;


import java.util.List;


@Controller
public class UsersController {

    private final UserService userService;

    @Autowired
    public UsersController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/admin")
    public String getUsers(Model model) {
        List<User> users = userService.findAll();
        model.addAttribute("users", users);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        model.addAttribute("userPrincipal", user);
        model.addAttribute("loginUserEmail", user.getEmail());
        StringBuilder sb = new StringBuilder();
        for(Role role : user.getRoles()) {
            sb.append(role.getName()).append(", ");
        }
        String roles = sb.toString().replaceAll("\\s*,\\s*$", "").replaceAll("ROLE_", "");;
        System.out.println(roles);
        model.addAttribute("loginUserRoles",  roles);
        model.addAttribute("newUser", new User());
        model.addAttribute("editUser", new User());
        return "users";
    }


    @GetMapping("/user")
    public String userPageShow(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        model.addAttribute("loginUserEmail", user.getEmail());
        StringBuilder sb = new StringBuilder();
        for(Role role : user.getRoles()) {
            sb.append(role.getName()).append(", ");
        }
        String roles = sb.toString().replaceAll("\\s*,\\s*$", "").replaceAll("ROLE_", "");;
        System.out.println(roles);
        model.addAttribute("loginUserRoles",  roles);
        model.addAttribute("userPrincipal", user);

        return "user";
    }


    @PostMapping("/saveUser")
    public String saveUser(@ModelAttribute("newUser") User newUser) {
        userService.saveUser(newUser);
        return "redirect:/admin";
    }


    @PostMapping("admin/edit/{id}")
    public String updateUser(@ModelAttribute("editUser") User editUser, @PathVariable("id") int id) {
        userService.update(id, editUser);
        System.out.println(editUser);
        return "redirect:/admin";

    }

    @PostMapping("admin/delete/{id}")
    public String deleteUser(@PathVariable("id") int id, @ModelAttribute("user") User user) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }



}