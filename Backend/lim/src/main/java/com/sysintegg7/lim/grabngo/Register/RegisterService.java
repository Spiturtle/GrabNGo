package com.sysintegg7.lim.grabngo.Register;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

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

    public String changePassword(ChangePasswordDTO dto) {
        if (dto.getInstitutionalEmail() == null || dto.getInstitutionalEmail().isBlank()) {
            return "Institutional email is required.";
        }
        if (dto.getCurrentPassword() == null || dto.getCurrentPassword().isBlank()) {
            return "Current password is required.";
        }
        if (dto.getNewPassword() == null || dto.getNewPassword().isBlank()) {
            return "New password is required.";
        }
        if (dto.getConfirmPassword() == null || dto.getConfirmPassword().isBlank()) {
            return "Please confirm your new password.";
        }
        Optional<RegisterEntity> userOpt = registerRepository.findByInstitutionalEmail(dto.getInstitutionalEmail());
        if (userOpt.isEmpty()) {
            return "User not found.";
        }

        RegisterEntity user = userOpt.get();
        if (!passwordEncoder.matches(dto.getCurrentPassword(), user.getPassword())) {
            return "Current password is incorrect.";
        }

        if (!dto.getNewPassword().equals(dto.getConfirmPassword())) {
            return "New password and confirm password do not match.";
        }

        if (dto.getNewPassword().length() < 8
                || !dto.getNewPassword().matches(".*[A-Z].*")
                || !dto.getNewPassword().matches(".*[a-z].*")
                || !dto.getNewPassword().matches(".*[0-9].*")
                || !dto.getNewPassword().matches(".*[^A-Za-z0-9].*")) {
            return "New password does not meet strength requirements.";
        }

        if (passwordEncoder.matches(dto.getNewPassword(), user.getPassword())) {
            return "New password must be different from current password.";
        }

        user.setPassword(passwordEncoder.encode(dto.getNewPassword()));
        registerRepository.save(user);

        return "Password changed successfully.";
    }

    public String updateProfile(UpdateProfileDTO dto) {
        if (dto.getInstitutionalEmail() == null || dto.getInstitutionalEmail().isBlank()) {
            return "Institutional email is required.";
        }
        if (dto.getFullName() == null || dto.getFullName().isBlank()) {
            return "Full name is required.";
        }

        Optional<RegisterEntity> userOpt = registerRepository.findByInstitutionalEmail(dto.getInstitutionalEmail());
        if (userOpt.isEmpty()) {
            return "User not found.";
        }

        RegisterEntity user = userOpt.get();
        user.setFullName(dto.getFullName().trim());
        registerRepository.save(user);

        return "Profile updated successfully.";
    }

    public ProfileDTO getProfile(String institutionalEmail) {
        if (institutionalEmail == null || institutionalEmail.isBlank()) {
            return null;
        }

        Optional<RegisterEntity> userOpt = registerRepository.findByInstitutionalEmail(institutionalEmail);
        if (userOpt.isEmpty()) {
            return null;
        }

        RegisterEntity user = userOpt.get();
        ProfileDTO profile = new ProfileDTO();
        profile.setInstitutionalEmail(user.getInstitutionalEmail());
        profile.setFullName(user.getFullName());
        profile.setStudentId(user.getStudentId());
        return profile;
    }
}
