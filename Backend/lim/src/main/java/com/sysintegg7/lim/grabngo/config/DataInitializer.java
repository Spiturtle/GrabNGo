package com.sysintegg7.lim.grabngo.config;

import com.sysintegg7.lim.grabngo.Meal.MealEntity;
import com.sysintegg7.lim.grabngo.Meal.MealRepository;
import com.sysintegg7.lim.grabngo.Register.RegisterEntity;
import com.sysintegg7.lim.grabngo.Register.RegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RegisterRepository registerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private MealRepository mealRepository;

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

        if (mealRepository.count() == 0) {
            List<MealEntity> defaultMeals = List.of(
                    new MealEntity(null, "Chicken Teriyaki Bowl", "Sweet-savory chicken over rice.", new BigDecimal("145.00"), true),
                    new MealEntity(null, "Beef Tapa Rice", "Filipino-style marinated beef tapa.", new BigDecimal("165.00"), true),
                    new MealEntity(null, "Sisig Rice Bowl", "Crispy, spicy sisig with garlic rice.", new BigDecimal("140.00"), true),
                    new MealEntity(null, "Creamy Carbonara", "Rich pasta with cream and bacon.", new BigDecimal("160.00"), true)
            );

            mealRepository.saveAll(defaultMeals);
            System.out.println("✓ Default meal catalog created.");
        }
    }
}
