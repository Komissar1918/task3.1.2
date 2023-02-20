package ru.itmentor.spring.boot_security.demo.controllers;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ControllerSuccessAuthorizationHandler {
    @GetMapping("/")
    public String getTemplate() {
        return "users";
    }
}
