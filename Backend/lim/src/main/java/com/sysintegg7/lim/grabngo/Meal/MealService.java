package com.sysintegg7.lim.grabngo.Meal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MealService {

    @Autowired
    private MealRepository mealRepository;

    public List<MealEntity> getAvailableMeals() {
        return mealRepository.findByAvailableTrueOrderByNameAsc();
    }

    public List<MealEntity> getAllMeals() {
        return mealRepository.findAllByOrderByNameAsc();
    }

    public MealEntity createMeal(MealDTO dto) {
        MealEntity meal = new MealEntity();
        applyUpdate(meal, dto, true);
        return mealRepository.save(meal);
    }

    public MealEntity updateMeal(Long id, MealDTO dto) {
        MealEntity meal = mealRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Meal not found."));

        applyUpdate(meal, dto, false);
        return mealRepository.save(meal);
    }

    public void deleteMeal(Long id) {
        if (!mealRepository.existsById(id)) {
            throw new IllegalArgumentException("Meal not found.");
        }
        mealRepository.deleteById(id);
    }

    private void applyUpdate(MealEntity meal, MealDTO dto, boolean isCreate) {
        if (dto.getName() == null || dto.getName().trim().isEmpty()) {
            throw new IllegalArgumentException("Meal name is required.");
        }

        if (dto.getPrice() == null || dto.getPrice().doubleValue() < 0) {
            throw new IllegalArgumentException("Price must be a valid non-negative number.");
        }

        meal.setName(dto.getName().trim());
        meal.setDescription(dto.getDescription() == null ? "" : dto.getDescription().trim());
        meal.setPrice(dto.getPrice());
        meal.setAvailable(dto.getAvailable() != null ? dto.getAvailable() : isCreate || meal.isAvailable());
    }
}
