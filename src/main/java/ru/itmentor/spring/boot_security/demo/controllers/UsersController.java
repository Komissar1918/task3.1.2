package ru.itmentor.spring.boot_security.demo.controllers;

import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.annotation.*;
import ru.itmentor.spring.boot_security.demo.models.User;
import ru.itmentor.spring.boot_security.demo.services.UserService;
import ru.itmentor.spring.boot_security.demo.util.UserErrorResponse;
import ru.itmentor.spring.boot_security.demo.util.UserNotCreatedException;
import ru.itmentor.spring.boot_security.demo.util.UserNotFoundException;

import javax.validation.Valid;
import java.util.List;
import java.util.Optional;


@RestController
public class UsersController {

    private final UserService userService;
    private final ModelMapper modelMapper;

    @Autowired
    public UsersController(UserService userService, ModelMapper modelMapper) {
        this.userService = userService;
        this.modelMapper = modelMapper;
    }

    @GetMapping("/admin")
    public List<User> getUsers() {
        return userService.findAll();
    }


    @GetMapping("/user")
    public User userPageShow() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        return (User) authentication.getPrincipal();
    }


    @PostMapping("/saveUser")
    public ResponseEntity<HttpStatus> saveUser(@RequestBody @Valid User newUser,
                                               BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            StringBuilder errorMsg = new StringBuilder();
            List<FieldError> errors = bindingResult.getFieldErrors();
            for(FieldError error : errors) {
                errorMsg.append(error.getField())
                        .append(" - ")
                        .append(error.getDefaultMessage())
                        .append(";");
            }
            throw new UserNotCreatedException(errorMsg.toString());
        }
        userService.saveUser(newUser);
        return ResponseEntity.ok(HttpStatus.OK);
    }


    @PostMapping("admin/edit/{id}")
    public ResponseEntity<HttpStatus> updateUser(@RequestBody User editUser,
                             @PathVariable("id") int id,
                             BindingResult bindingResult) {
        if(bindingResult.hasErrors()) {
            throw new UserNotFoundException();
        }
        if(!userService.findUserById(id).getClass().equals(User.class)) {
            userService.update(id, editUser);
        } else {
            throw new UserNotFoundException();
        }
        userService.update(id, editUser);
        return ResponseEntity.ok(HttpStatus.OK);

    }

    @PostMapping("admin/delete/{id}")
    public ResponseEntity<HttpStatus> deleteUser(@PathVariable("id") int id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(HttpStatus.OK);
    }

    @ExceptionHandler
    private ResponseEntity<UserErrorResponse> handleException(UserNotFoundException e) {
        UserErrorResponse userErrorResponse = new UserErrorResponse (
                "User with this id was not found");
        return new ResponseEntity<>(userErrorResponse, HttpStatus.NOT_FOUND);
    }
    @ExceptionHandler
    private ResponseEntity<UserErrorResponse> handleException(UserNotCreatedException e) {
        UserErrorResponse userErrorResponse = new UserErrorResponse (
                e.getMessage());
        return new ResponseEntity<>(userErrorResponse, HttpStatus.BAD_REQUEST);
    }
}