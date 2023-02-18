package ru.itmentor.spring.boot_security.demo.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import ru.itmentor.spring.boot_security.demo.models.Role;
import ru.itmentor.spring.boot_security.demo.models.User;
import ru.itmentor.spring.boot_security.demo.services.RoleService;
import ru.itmentor.spring.boot_security.demo.services.UserService;
import ru.itmentor.spring.boot_security.demo.util.UserErrorResponse;
import ru.itmentor.spring.boot_security.demo.util.UserNotFoundException;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;


@RestController
public class UsersController {

    private final UserService userService;
    private final RoleService roleService;
    private final ModelMapper modelMapper;

    @Autowired
    public UsersController(UserService userService, RoleService roleService, ModelMapper modelMapper) {
        this.userService = userService;
        this.roleService = roleService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/admin")
    public List<User> getUsers(Model model) {
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
        model.addAttribute("roles", roleService.getAllRoles());
        return users;
    }


    @GetMapping("/user")
    public User userPageShow(Model model) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        User user = (User) authentication.getPrincipal();
        model.addAttribute("loginUserEmail", user.getEmail());
        StringBuilder sb = new StringBuilder();
        for(Role role : user.getRoles()) {
            sb.append(role.getName()).append(", ");        }
        String roles = sb.toString().replaceAll("\\s*,\\s*$", "").replaceAll("ROLE_", "");;
        System.out.println(roles);
        model.addAttribute("loginUserRoles",  roles);
        model.addAttribute("userPrincipal", user);


        return user;
    }


    @PostMapping("/saveUser")
    public String saveUser(@ModelAttribute("newUser") User newUser, @RequestParam("selectedRolesForNewUser") ArrayList<Role> roles) {
        HashSet<Role> setRoles = new HashSet<>(roles);
        newUser.setRoles(setRoles);
        System.out.println(newUser);
        setRoles.forEach(System.out::println);
        userService.saveUser(newUser);
        return "redirect:/admin";
    }


    @PostMapping("admin/edit/{id}")
    public String updateUser(@ModelAttribute("editUser") User editUser, @RequestParam(value = "selectedRoles", defaultValue = "1") ArrayList<Role> roles, @PathVariable("id") int id) {
        if(roles != null) {
            Set<Role> setRoles = new HashSet<>(roles);
            editUser.setRoles(setRoles);
        } else {
            User editUserWithoutEditRoles = userService.findUserById(id);
            Set<Role> notEditRoles = editUserWithoutEditRoles.getRoles();
            editUser.setRoles(notEditRoles);
        }
        System.out.println(editUser);
        editUser.getRoles().forEach(System.out::println);
        userService.update(id, editUser);
        return "redirect:/admin";

    }

    @PostMapping("admin/delete/{id}")
    public String deleteUser(@PathVariable("id") int id, @ModelAttribute("user") User user) {
        userService.deleteUser(id);
        return "redirect:/admin";
    }

    private ResponseEntity<UserErrorResponse> handleException(UserNotFoundException e) {
        UserErrorResponse userErrorResponse = new UserErrorResponse (
                "User with this id was not found");
        return new ResponseEntity<>(userErrorResponse, HttpStatus.NOT_FOUND);
    }

}