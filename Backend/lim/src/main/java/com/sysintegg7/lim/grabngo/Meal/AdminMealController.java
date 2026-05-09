package com.sysintegg7.lim.grabngo.Meal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/meals")
@CrossOrigin(origins = "http://localhost:5173")
public class AdminMealController {

    @Autowired
    private MealService mealService;

    @GetMapping
    public ResponseEntity<List<MealEntity>> getAllMeals() {
        return ResponseEntity.ok(mealService.getAllMeals());
    }

    @PostMapping
    public ResponseEntity<?> createMeal(@RequestBody MealDTO dto) {
        try {
            return ResponseEntity.ok(mealService.createMeal(dto));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateMeal(@PathVariable Long id, @RequestBody MealDTO dto) {
        try {
            return ResponseEntity.ok(mealService.updateMeal(id, dto));
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMeal(@PathVariable Long id) {
        try {
            mealService.deleteMeal(id);
            return ResponseEntity.ok("Meal deleted successfully.");
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
