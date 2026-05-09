package com.sysintegg7.lim.grabngo.Meal;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/meals")
@CrossOrigin(origins = {
    "http://localhost:5173",
    "https://grab-n-go-xi.vercel.app"
})
public class MealController {

    @Autowired
    private MealService mealService;

    @GetMapping
    public ResponseEntity<List<MealEntity>> getAvailableMeals() {
        return ResponseEntity.ok(mealService.getAvailableMeals());
    }
}
