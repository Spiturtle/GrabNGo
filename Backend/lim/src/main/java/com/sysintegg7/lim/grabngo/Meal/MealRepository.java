package com.sysintegg7.lim.grabngo.Meal;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MealRepository extends JpaRepository<MealEntity, Long> {
    List<MealEntity> findByAvailableTrueOrderByNameAsc();
    List<MealEntity> findAllByOrderByNameAsc();
}
