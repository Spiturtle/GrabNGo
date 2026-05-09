package com.sysintegg7.lim.grabngo.Login;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://grab-n-go-xi.vercel.app"
})
public class LoginController {

    @Autowired
    private LoginService loginService;

    @PostMapping("/login")
    public ResponseEntity<LoginEntity> login(@RequestBody LoginDTO dto) {
        LoginEntity result = loginService.login(dto);
        if (result.getMessage().equals("Login successful.")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.status(401).body(result);
    }
}