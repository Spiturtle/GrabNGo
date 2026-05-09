package com.sysintegg7.lim.grabngo.Register;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://grab-n-go-xi.vercel.app"
})
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

    @PostMapping("/change-password")
    public ResponseEntity<String> changePassword(@RequestBody ChangePasswordDTO dto) {
        String result = registerService.changePassword(dto);
        if (result.equals("Password changed successfully.")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }

    @PostMapping("/update-profile")
    public ResponseEntity<String> updateProfile(@RequestBody UpdateProfileDTO dto) {
        String result = registerService.updateProfile(dto);
        if (result.equals("Profile updated successfully.")) {
            return ResponseEntity.ok(result);
        }
        return ResponseEntity.badRequest().body(result);
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@RequestParam String institutionalEmail) {
        ProfileDTO profile = registerService.getProfile(institutionalEmail);
        if (profile == null) {
            return ResponseEntity.status(404).body("User not found.");
        }
        return ResponseEntity.ok(profile);
    }
}