package com.sysintegg7.lim.grabngo.Register;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class RegisterService {

    @Autowired
    private RegisterRepository registerRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public String register(RegisterDTO dto) {
        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            return "Passwords do not match.";
        }
        if (registerRepository.existsByInstitutionalEmail(dto.getInstitutionalEmail())) {
            return "Email is already registered.";
        }
        if (registerRepository.existsByStudentId(dto.getStudentId())) {
            return "Student ID is already registered.";
        }

        RegisterEntity user = new RegisterEntity();
        user.setStudentId(dto.getStudentId());
        user.setInstitutionalEmail(dto.getInstitutionalEmail());
        user.setFullName(dto.getFullName());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));

        registerRepository.save(user);
        return "Account created successfully.";
    }
}
