package com.sysintegg7.lim.grabngo.Register;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class RegisterController {

    @Autowired
    private RegisterService registerService;

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterDTO dto) {
        String result = registerService.register(dto);
        if (result.equals("Account created successfully.")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }
}