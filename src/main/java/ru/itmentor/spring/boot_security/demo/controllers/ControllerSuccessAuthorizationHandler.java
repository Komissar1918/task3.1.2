package ru.itmentor.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ControllerSuccessAuthorizationHandler {

    @GetMapping("/admin")
    public String getAdminTemplate() {
        return "users";
    }

    @GetMapping("/user")
    public String getUserTemplate() {
        return "user";
    }
}
