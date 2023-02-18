package ru.itmentor.spring.boot_security.demo.util;

public class UserErrorResponse {
    private String msg;

    public UserErrorResponse(String msg) {
        this.msg = msg;
    }
    public String getMsg() {
        return msg;
    }

    public void setMsg(String msg) {
        this.msg = msg;
    }



}
