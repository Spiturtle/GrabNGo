package com.sysintegg7.lim.grabngo.Login;

import com.sysintegg7.lim.grabngo.Register.RegisterEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface LoginRepository extends JpaRepository<RegisterEntity, Long> {
    Optional<RegisterEntity> findByInstitutionalEmail(String institutionalEmail);
}