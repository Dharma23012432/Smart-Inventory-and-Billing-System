package com.example.demo.Service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.mail.MailException;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {
    private final JavaMailSender javaMailSender;
    private final Logger log = LoggerFactory.getLogger(MailService.class);

    public MailService(JavaMailSender javaMailSender) {
        this.javaMailSender = javaMailSender;
    }

    public boolean sendMail(String to, String subject, String body) {
        try {
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setFrom("smkd3081@gmail.com"); // optional
            msg.setTo(to);
            msg.setSubject(subject);
            msg.setText(body);
            javaMailSender.send(msg);
            log.info("Mail sent to {}", to);
            return true;
        } catch (MailException ex) {
            // log full stack (debug) and short message for info
            log.error("Failed to send email to {} — cause: {}", to, ex.getMessage());
            log.debug("Mail exception stacktrace:", ex);
            return false;
        }
    }

    public boolean sendLowStockEmail(String productName, String supplierMail, int currentStock) {
        String subject = "Low Stock Alert - " + productName;
        String body = "Dear Supplier,\n\n"
                + "Our product \"" + productName + "\" has dropped to " + currentStock + " units.\n"
                + "Please send additional stock as soon as possible.\n\n"
                + "Regards,\nSmart Inventory System";

        return sendMail(supplierMail, subject, body);
    }
        public boolean testMailConnection() {
        try {
            // Create a simple test message
            SimpleMailMessage msg = new SimpleMailMessage();
            msg.setTo("dlingam850@gmail.com"); // use your own email
            msg.setSubject("SMTP Test - Smart Inventory");
            msg.setText("✅ Your SMTP connection is working fine!");

            javaMailSender.send(msg);
            System.out.println("✅ Test mail sent successfully!");
            return true;
        } catch (Exception e) {
            System.err.println("❌ Test mail failed: " + e.getMessage());
            return false;
        }
    }
}

//    public boolean testMailConnection() {
//        try {
//            // Create a simple test message
//            SimpleMailMessage msg = new SimpleMailMessage();
//            msg.setTo("dlingam850@gmail.com"); // use your own email
//            msg.setSubject("SMTP Test - Smart Inventory");
//            msg.setText("✅ Your SMTP connection is working fine!");
//
//            javaMailSender.send(msg);
//            System.out.println("✅ Test mail sent successfully!");
//            return true;
//        } catch (Exception e) {
//            System.err.println("❌ Test mail failed: " + e.getMessage());
//            return false;
//        }
//    }


