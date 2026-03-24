"""Bundled exercise database — 38 exercises across 8 categories."""

EXERCISES_DB = [
    # Chest
    {"name": "Push-ups", "category": "Chest", "muscles": "Pectorals, Triceps, Deltoids", "description": "Classic bodyweight exercise. Start in plank position, lower chest to floor, push back up.", "difficulty": "Beginner"},
    {"name": "Bench Press", "category": "Chest", "muscles": "Pectorals, Triceps, Deltoids", "description": "Lie on bench, lower barbell to chest, press up. Keep feet flat on floor.", "difficulty": "Intermediate"},
    {"name": "Incline Dumbbell Press", "category": "Chest", "muscles": "Upper Pectorals, Deltoids", "description": "Set bench to 30-45 degrees, press dumbbells up from chest level.", "difficulty": "Intermediate"},
    {"name": "Chest Dips", "category": "Chest", "muscles": "Lower Pectorals, Triceps", "description": "Lean forward on dip bars, lower body by bending elbows, push back up.", "difficulty": "Advanced"},
    {"name": "Cable Flyes", "category": "Chest", "muscles": "Pectorals, Deltoids", "description": "Use cable machine, bring hands together in front of chest in arc motion.", "difficulty": "Intermediate"},
    # Back
    {"name": "Pull-ups", "category": "Back", "muscles": "Latissimus Dorsi, Biceps", "description": "Hang from bar with overhand grip, pull chin above bar, lower with control.", "difficulty": "Intermediate"},
    {"name": "Bent-Over Rows", "category": "Back", "muscles": "Rhomboids, Latissimus Dorsi, Biceps", "description": "Hinge at hips, pull barbell to lower chest, squeeze shoulder blades.", "difficulty": "Intermediate"},
    {"name": "Deadlift", "category": "Back", "muscles": "Erector Spinae, Glutes, Hamstrings", "description": "Lift barbell from floor by extending hips and knees. Keep back straight.", "difficulty": "Advanced"},
    {"name": "Lat Pulldown", "category": "Back", "muscles": "Latissimus Dorsi, Biceps", "description": "Pull cable bar to upper chest, squeeze lats, slowly release.", "difficulty": "Beginner"},
    {"name": "Seated Cable Row", "category": "Back", "muscles": "Rhomboids, Trapezius, Biceps", "description": "Sit upright, pull cable handle to torso, squeeze back muscles.", "difficulty": "Beginner"},
    # Legs
    {"name": "Squats", "category": "Legs", "muscles": "Quadriceps, Glutes, Hamstrings", "description": "Stand with feet shoulder-width apart, bend knees to lower hips, stand back up.", "difficulty": "Beginner"},
    {"name": "Lunges", "category": "Legs", "muscles": "Quadriceps, Glutes, Hamstrings", "description": "Step forward, lower back knee toward floor, push back to standing.", "difficulty": "Beginner"},
    {"name": "Leg Press", "category": "Legs", "muscles": "Quadriceps, Glutes", "description": "Sit on leg press machine, push platform away by extending knees.", "difficulty": "Intermediate"},
    {"name": "Romanian Deadlift", "category": "Legs", "muscles": "Hamstrings, Glutes, Erector Spinae", "description": "Hold barbell, hinge at hips keeping legs nearly straight, lower to shin level.", "difficulty": "Intermediate"},
    {"name": "Calf Raises", "category": "Legs", "muscles": "Gastrocnemius, Soleus", "description": "Stand on edge of step, raise heels up, lower below platform level.", "difficulty": "Beginner"},
    # Arms
    {"name": "Bicep Curls", "category": "Arms", "muscles": "Biceps Brachii", "description": "Hold dumbbells at sides, curl up by bending elbows, lower with control.", "difficulty": "Beginner"},
    {"name": "Tricep Dips", "category": "Arms", "muscles": "Triceps", "description": "Use bench behind you, lower body by bending elbows, push back up.", "difficulty": "Beginner"},
    {"name": "Hammer Curls", "category": "Arms", "muscles": "Biceps, Brachialis, Forearms", "description": "Curl dumbbells with neutral (hammer) grip, keep elbows stationary.", "difficulty": "Beginner"},
    {"name": "Skull Crushers", "category": "Arms", "muscles": "Triceps", "description": "Lie on bench, lower barbell to forehead by bending elbows, extend back up.", "difficulty": "Intermediate"},
    {"name": "Concentration Curls", "category": "Arms", "muscles": "Biceps Brachii (Peak)", "description": "Sit on bench, brace elbow on inner thigh, curl dumbbell up.", "difficulty": "Intermediate"},
    # Shoulders
    {"name": "Overhead Press", "category": "Shoulders", "muscles": "Deltoids, Triceps, Trapezius", "description": "Press barbell or dumbbells from shoulders to overhead, lock out arms.", "difficulty": "Intermediate"},
    {"name": "Lateral Raises", "category": "Shoulders", "muscles": "Lateral Deltoids", "description": "Hold dumbbells at sides, raise to shoulder height with slight bend in elbows.", "difficulty": "Beginner"},
    {"name": "Face Pulls", "category": "Shoulders", "muscles": "Rear Deltoids, Rotator Cuff", "description": "Pull cable rope to face level, squeeze shoulder blades, control return.", "difficulty": "Beginner"},
    {"name": "Arnold Press", "category": "Shoulders", "muscles": "All Deltoid Heads", "description": "Start with palms facing you, rotate and press overhead in one motion.", "difficulty": "Intermediate"},
    # Core
    {"name": "Plank", "category": "Core", "muscles": "Rectus Abdominis, Transverse Abdominis", "description": "Hold push-up position on forearms, keep body straight. Hold for time.", "difficulty": "Beginner"},
    {"name": "Russian Twists", "category": "Core", "muscles": "Obliques, Rectus Abdominis", "description": "Sit with knees bent, lean back slightly, rotate torso side to side.", "difficulty": "Intermediate"},
    {"name": "Hanging Leg Raises", "category": "Core", "muscles": "Lower Abs, Hip Flexors", "description": "Hang from bar, raise legs to 90 degrees, lower with control.", "difficulty": "Advanced"},
    {"name": "Dead Bug", "category": "Core", "muscles": "Deep Core Stabilizers", "description": "Lie on back, extend opposite arm and leg while keeping lower back flat.", "difficulty": "Beginner"},
    {"name": "Mountain Climbers", "category": "Core", "muscles": "Core, Hip Flexors, Shoulders", "description": "In plank position, alternate driving knees to chest at a fast pace.", "difficulty": "Intermediate"},
    # Cardio
    {"name": "Running", "category": "Cardio", "muscles": "Full Body, Cardiovascular System", "description": "Steady-state or interval running. Great for cardiovascular health and endurance.", "difficulty": "Beginner"},
    {"name": "Jump Rope", "category": "Cardio", "muscles": "Calves, Shoulders, Core", "description": "Skip rope with both feet, maintain rhythm. Excellent for coordination.", "difficulty": "Beginner"},
    {"name": "Burpees", "category": "Cardio", "muscles": "Full Body", "description": "Drop to push-up, perform push-up, jump feet forward, jump up with arms overhead.", "difficulty": "Advanced"},
    {"name": "Cycling", "category": "Cardio", "muscles": "Quadriceps, Hamstrings, Glutes", "description": "Stationary or outdoor cycling. Low-impact cardiovascular exercise.", "difficulty": "Beginner"},
    {"name": "High Knees", "category": "Cardio", "muscles": "Hip Flexors, Quads, Core", "description": "Run in place bringing knees to hip height. Keep core engaged.", "difficulty": "Beginner"},
    # Stretching
    {"name": "Downward Dog", "category": "Stretching", "muscles": "Hamstrings, Calves, Shoulders", "description": "From all fours, lift hips up and back forming inverted V. Hold and breathe.", "difficulty": "Beginner"},
    {"name": "Pigeon Pose", "category": "Stretching", "muscles": "Hip Flexors, Glutes, Piriformis", "description": "Bring one knee forward, extend other leg back. Hold for deep stretch.", "difficulty": "Intermediate"},
    {"name": "Cat-Cow Stretch", "category": "Stretching", "muscles": "Spine, Core, Neck", "description": "On all fours, alternate between arching and rounding back with breath.", "difficulty": "Beginner"},
    {"name": "Seated Forward Fold", "category": "Stretching", "muscles": "Hamstrings, Lower Back", "description": "Sit with legs extended, reach toward toes. Keep back as flat as possible.", "difficulty": "Beginner"},
]


def get_exercises(category: str | None = None, difficulty: str | None = None) -> list:
    results = EXERCISES_DB
    if category:
        results = [e for e in results if e["category"].lower() == category.lower()]
    if difficulty:
        results = [e for e in results if e["difficulty"].lower() == difficulty.lower()]
    return results
