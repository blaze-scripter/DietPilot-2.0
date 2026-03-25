export const userProfile = {
  name: "Alex",
  age: 28,
  gender: "Male",
  height: 178,
  weight: 75,
  goalCalories: 2200,
  goalProtein: 150,
  goalCarbs: 250,
  goalFat: 70,
};

export const todayLog = {
  date: new Date().toISOString(),
  calories: 1480,
  protein: 92,
  carbs: 164,
  fat: 48,
  meals: [
    {
      id: "1",
      type: "Breakfast" as const,
      name: "Avocado Toast & Eggs",
      calories: 420,
      protein: 22,
      carbs: 38,
      fat: 18,
      time: "8:30 AM",
      image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&h=300&fit=crop",
    },
    {
      id: "2",
      type: "Lunch" as const,
      name: "Grilled Chicken Salad",
      calories: 520,
      protein: 42,
      carbs: 28,
      fat: 16,
      time: "12:45 PM",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=300&fit=crop",
    },
    {
      id: "3",
      type: "Snack" as const,
      name: "Greek Yogurt & Berries",
      calories: 180,
      protein: 14,
      carbs: 22,
      fat: 4,
      time: "3:15 PM",
      image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=300&fit=crop",
    },
    {
      id: "4",
      type: "Dinner" as const,
      name: "Salmon & Quinoa Bowl",
      calories: 360,
      protein: 14,
      carbs: 76,
      fat: 10,
      time: "7:00 PM",
      image: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=400&h=300&fit=crop",
    },
  ],
};

export const weeklyStats = [
  { day: "Mon", calories: 2050, protein: 130, carbs: 220, fat: 65 },
  { day: "Tue", calories: 1890, protein: 140, carbs: 190, fat: 58 },
  { day: "Wed", calories: 2200, protein: 155, carbs: 240, fat: 72 },
  { day: "Thu", calories: 1750, protein: 120, carbs: 200, fat: 52 },
  { day: "Fri", calories: 2100, protein: 148, carbs: 230, fat: 68 },
  { day: "Sat", calories: 2350, protein: 135, carbs: 270, fat: 80 },
  { day: "Sun", calories: 1480, protein: 92, carbs: 164, fat: 48 },
];

export const streakDays = 12;
