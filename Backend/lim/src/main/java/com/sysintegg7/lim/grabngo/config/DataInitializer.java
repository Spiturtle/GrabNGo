package com.sysintegg7.lim.grabngo.config;

import com.sysintegg7.lim.grabngo.Register.RegisterEntity;
import com.sysintegg7.lim.grabngo.Register.RegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RegisterRepository registerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        if (registerRepository.findByInstitutionalEmail("admin@grabngo.com").isEmpty()) {
            RegisterEntity admin = new RegisterEntity();
            admin.setStudentId("ADMIN-0000");
            admin.setInstitutionalEmail("admin@grabngo.com");
            admin.setFullName("GrabNGo Administrator");
            admin.setPassword(passwordEncoder.encode("Admin@GrabNGo1"));
            admin.setRole("ADMIN");

            registerRepository.save(admin);
            System.out.println("✓ Default admin account created:");
            System.out.println("  Email:    admin@grabngo.com");
            System.out.println("  Password: Admin@GrabNGo1");
            System.out.println("  ⚠ CHANGE THIS PASSWORD IN PRODUCTION!");
        }
    }
}
