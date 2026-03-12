package com.sysintegg7.lim.grabngo.Admin;

import com.sysintegg7.lim.grabngo.Register.RegisterEntity;
import com.sysintegg7.lim.grabngo.Register.RegisterRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AdminLoginService {

    @Autowired
    private RegisterRepository registerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String login(AdminLoginDTO dto) {
        Optional<RegisterEntity> userOpt = registerRepository.findByInstitutionalEmail(dto.getEmail());

        if (userOpt.isEmpty()) {
            return "Invalid email or password.";
        }

        RegisterEntity user = userOpt.get();

        if (!"ADMIN".equals(user.getRole())) {
            return "Access denied. Not an admin account.";
        }

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            return "Invalid email or password.";
        }

        return "Login successful.";
    }
}
