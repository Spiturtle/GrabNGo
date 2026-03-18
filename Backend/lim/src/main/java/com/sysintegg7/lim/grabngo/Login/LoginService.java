package com.sysintegg7.lim.grabngo.Login;

import com.sysintegg7.lim.grabngo.Register.RegisterEntity;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LoginService {

    @Autowired
    private LoginRepository loginRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public LoginEntity login(LoginDTO dto) {
        Optional<RegisterEntity> userOpt = loginRepository.findByInstitutionalEmail(dto.getInstitutionalEmail());

        if (userOpt.isEmpty()) {
            return new LoginEntity("Invalid email or password.", null, null, null);
        }

        RegisterEntity user = userOpt.get();

        if (!passwordEncoder.matches(dto.getPassword(), user.getPassword())) {
            return new LoginEntity("Invalid email or password.", null, null, null);
        }

        return new LoginEntity("Login successful.", user.getInstitutionalEmail(), user.getFullName(), user.getStudentId());
    }
}
