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
                " with roles " + userDetails.getUser().getRole());
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




    @GetMapping("/addNewUser")
    public String addNewUser(Model model) {
        model.addAttribute("user", new User());
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        model.addAttribute("userPrincipal", userDetails.getUser());
        model.addAttribute("loginUserInfo", userDetails.getUser().getName() + " " + userDetails.getUser().getSurname() +
                " with roles " + userDetails.getUser().getRole());
        return "userInfo";
    }

    @PostMapping("/saveUser")
    public String saveUser(@ModelAttribute("user") User user) {
        System.out.println("Новый user");
        userService.save(user);
        return "redirect:/admin";
    }

    @GetMapping("/{id}/edit")
    public String editUser(@PathVariable("id") int id, Model model) {
        model.addAttribute("user", userService.findOne(id));
        return "edit";
    }

    @PatchMapping("admin/edit/{id}")
    public String updateUser(@ModelAttribute("user") User user, @PathVariable("id") int id) {
        userService.update(id, user);
        return "redirect:/admin";
    }

    @DeleteMapping("admin/{id}")
    public String deleteUser(@PathVariable("id") int id) {
        userService.delete(id);
        return "redirect:/admin";
    }



}