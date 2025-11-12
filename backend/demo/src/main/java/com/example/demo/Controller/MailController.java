package com.example.demo.Controller;

import com.example.demo.Service.MailService;
import com.example.demo.Service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/email")
public class MailController {
    @Autowired
    private MailService mailService;

    @Autowired
    private ProductService productService;

    @GetMapping("/product")
    public String getEmail() {
        mailService.sendMail(
                "dlingam850@gmail.com",
                "Sample Check Up",
                "Test mail from spring boot"
        );
        return "Email Sent Successfully";
    }


    @GetMapping("/test")
    public String testMail() {
        boolean success = mailService.testMailConnection();
        return success ? " Mail connection working fine!" : " Mail connection failed!";
    }


}
