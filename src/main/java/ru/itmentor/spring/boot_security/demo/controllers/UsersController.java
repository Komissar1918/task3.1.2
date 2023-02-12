package ru.itmentor.spring.boot_security.demo.controllers;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.itmentor.spring.boot_security.demo.models.User;
import ru.itmentor.spring.boot_security.demo.security.UserDetailsImpl;
import ru.itmentor.spring.boot_security.demo.services.UserDetailsServiceImpl;


import java.util.List;


@Controller
public class UsersController {

    private final UserDetailsServiceImpl userService;

    @Autowired
    public UsersController(UserDetailsServiceImpl userService) {
        this.userService = userService;
    }

    @GetMapping("/admin")
    public String getUsers(Model model) {
        List<User> users = userService.findAll();
        model.addAttribute("users", users);
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        model.addAttribute("userPrincipal", userDetails.getUser());
        model.addAttribute("loginUserInfo", userDetails.getUser().getName() + " " + userDetails.getUser().getSurname() +
                " with roles " + userDetails.getUser().getRole().replace("ROLE_", ""));
        model.addAttribute("newUser", new User());
        return "users";
    }


    @GetMapping("/user")
    public String userPageShow(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        model.addAttribute("loginUserInfo", userDetails.getUser().getName() + " " + userDetails.getUser().getSurname() +
                " with roles " + userDetails.getUser().getRole());
        model.addAttribute("userPrincipal", userDetails.getUser());
        return "user";
    }


    @PostMapping("/saveUser")
    public String saveUser(@ModelAttribute("user") User user) {
        userService.save(user);
        return "redirect:/admin";
    }


    @PostMapping("admin/edit/{id}")
    public String updateUser(@ModelAttribute("user") User user, @PathVariable("id") int id) {
        userService.update(id, user);
        return "redirect:/admin";
    }

    @PostMapping("admin/delete/{id}")
    public String deleteUser(@PathVariable("id") int id) {
        userService.delete(id);
        return "redirect:/admin";
    }



}