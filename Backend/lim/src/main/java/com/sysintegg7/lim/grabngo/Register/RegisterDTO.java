package com.sysintegg7.lim.grabngo.Register;

public class RegisterDTO {
    private String studentId;
    private String institutionalEmail;
    private String fullName;
    private String password;
    private String confirmPassword;

    public String getStudentId() { return studentId; }
    public void setStudentId(String studentId) { this.studentId = studentId; }

    public String getInstitutionalEmail() { return institutionalEmail; }
    public void setInstitutionalEmail(String institutionalEmail) { this.institutionalEmail = institutionalEmail; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public String getConfirmPassword() { return confirmPassword; }
    public void setConfirmPassword(String confirmPassword) { this.confirmPassword = confirmPassword; }
}
