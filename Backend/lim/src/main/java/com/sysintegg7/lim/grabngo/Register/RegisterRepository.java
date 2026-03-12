package com.sysintegg7.lim.grabngo.Register;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RegisterRepository extends JpaRepository<RegisterEntity, Long> {
    boolean existsByInstitutionalEmail(String institutionalEmail);
    boolean existsByStudentId(String studentId);
    Optional<RegisterEntity> findByInstitutionalEmail(String institutionalEmail);
}
