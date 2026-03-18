package com.sysintegg7.lim.grabngo.Register;

import lombok.Data;

@Data
public class ChangePasswordDTO {
    private String institutionalEmail;
    private String currentPassword;
    private String newPassword;
    private String confirmPassword;
}
