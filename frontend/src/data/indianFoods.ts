/**
 * Indian Food Library — Comprehensive nutritional database
 * Covers North/South Indian, Street Food, Breads, Rice, Curries, Desserts, Beverages
 * All values per standard serving size
 */

export interface IndianFood {
  name: string;
  serving_size: number;
  serving_unit: string;
  calories: number;
  protein_g: number;
  carbs_g: number;
  fat_g: number;
  category: string;
  tags: string[];
}

export const INDIAN_FOODS: IndianFood[] = [
  // ── BREADS ────────────────────────────────────
  { name: "Roti (Chapati)", serving_size: 1, serving_unit: "piece", calories: 104, protein_g: 3.1, carbs_g: 18.3, fat_g: 2.6, category: "Bread", tags: ["wheat", "staple", "north indian"] },
  { name: "Naan", serving_size: 1, serving_unit: "piece", calories: 262, protein_g: 8.7, carbs_g: 45.4, fat_g: 5.1, category: "Bread", tags: ["wheat", "tandoor", "north indian"] },
  { name: "Butter Naan", serving_size: 1, serving_unit: "piece", calories: 310, protein_g: 9, carbs_g: 46, fat_g: 10, category: "Bread", tags: ["wheat", "tandoor", "butter"] },
  { name: "Garlic Naan", serving_size: 1, serving_unit: "piece", calories: 300, protein_g: 9.2, carbs_g: 48, fat_g: 7.5, category: "Bread", tags: ["wheat", "garlic", "tandoor"] },
  { name: "Paratha (Plain)", serving_size: 1, serving_unit: "piece", calories: 197, protein_g: 4.3, carbs_g: 27.6, fat_g: 7.9, category: "Bread", tags: ["wheat", "layered", "north indian"] },
  { name: "Aloo Paratha", serving_size: 1, serving_unit: "piece", calories: 280, protein_g: 5.8, carbs_g: 36, fat_g: 12, category: "Bread", tags: ["potato", "stuffed", "punjabi"] },
  { name: "Gobi Paratha", serving_size: 1, serving_unit: "piece", calories: 240, protein_g: 5.2, carbs_g: 30, fat_g: 10.5, category: "Bread", tags: ["cauliflower", "stuffed", "punjabi"] },
  { name: "Paneer Paratha", serving_size: 1, serving_unit: "piece", calories: 300, protein_g: 10, carbs_g: 32, fat_g: 14, category: "Bread", tags: ["paneer", "stuffed", "north indian"] },
  { name: "Puri", serving_size: 2, serving_unit: "piece", calories: 208, protein_g: 3.4, carbs_g: 24, fat_g: 11, category: "Bread", tags: ["deep fried", "wheat"] },
  { name: "Bhatura", serving_size: 1, serving_unit: "piece", calories: 310, protein_g: 6.5, carbs_g: 42, fat_g: 13, category: "Bread", tags: ["deep fried", "maida", "punjabi"] },
  { name: "Dosa (Plain)", serving_size: 1, serving_unit: "piece", calories: 133, protein_g: 3.9, carbs_g: 22, fat_g: 3.4, category: "Bread", tags: ["rice", "fermented", "south indian"] },
  { name: "Masala Dosa", serving_size: 1, serving_unit: "piece", calories: 250, protein_g: 5.5, carbs_g: 35, fat_g: 10, category: "Bread", tags: ["potato", "south indian", "fermented"] },
  { name: "Uttapam", serving_size: 1, serving_unit: "piece", calories: 180, protein_g: 5, carbs_g: 28, fat_g: 5, category: "Bread", tags: ["fermented", "south indian", "thick"] },
  { name: "Idli", serving_size: 2, serving_unit: "piece", calories: 130, protein_g: 4, carbs_g: 24, fat_g: 1.5, category: "Bread", tags: ["steamed", "fermented", "south indian"] },
  { name: "Appam", serving_size: 1, serving_unit: "piece", calories: 120, protein_g: 2.4, carbs_g: 22, fat_g: 2, category: "Bread", tags: ["rice", "fermented", "kerala"] },
  { name: "Rumali Roti", serving_size: 1, serving_unit: "piece", calories: 130, protein_g: 3.5, carbs_g: 22, fat_g: 3, category: "Bread", tags: ["thin", "wheat", "mughlai"] },

  // ── RICE DISHES ───────────────────────────────
  { name: "Steamed Basmati Rice", serving_size: 200, serving_unit: "g", calories: 260, protein_g: 5.2, carbs_g: 56, fat_g: 0.6, category: "Rice", tags: ["plain", "staple"] },
  { name: "Jeera Rice", serving_size: 200, serving_unit: "g", calories: 280, protein_g: 5.4, carbs_g: 54, fat_g: 5, category: "Rice", tags: ["cumin", "aromatic", "north indian"] },
  { name: "Chicken Biryani", serving_size: 250, serving_unit: "g", calories: 400, protein_g: 22, carbs_g: 48, fat_g: 14, category: "Rice", tags: ["chicken", "spiced", "hyderabadi"] },
  { name: "Mutton Biryani", serving_size: 250, serving_unit: "g", calories: 450, protein_g: 24, carbs_g: 46, fat_g: 18, category: "Rice", tags: ["mutton", "spiced", "hyderabadi"] },
  { name: "Veg Biryani", serving_size: 250, serving_unit: "g", calories: 320, protein_g: 8, carbs_g: 52, fat_g: 9, category: "Rice", tags: ["vegetable", "spiced"] },
  { name: "Egg Biryani", serving_size: 250, serving_unit: "g", calories: 370, protein_g: 16, carbs_g: 48, fat_g: 12, category: "Rice", tags: ["egg", "spiced"] },
  { name: "Pulao (Veg)", serving_size: 200, serving_unit: "g", calories: 270, protein_g: 5, carbs_g: 44, fat_g: 8, category: "Rice", tags: ["mixed veg", "aromatic"] },
  { name: "Lemon Rice", serving_size: 200, serving_unit: "g", calories: 250, protein_g: 4.5, carbs_g: 48, fat_g: 5, category: "Rice", tags: ["lemon", "south indian", "tempered"] },
  { name: "Curd Rice", serving_size: 200, serving_unit: "g", calories: 220, protein_g: 6, carbs_g: 38, fat_g: 5, category: "Rice", tags: ["yogurt", "south indian", "cooling"] },
  { name: "Khichdi", serving_size: 200, serving_unit: "g", calories: 230, protein_g: 8, carbs_g: 38, fat_g: 5.5, category: "Rice", tags: ["lentil", "comfort food", "easy digest"] },
  { name: "Tahari (Veg Pulao)", serving_size: 200, serving_unit: "g", calories: 260, protein_g: 5, carbs_g: 46, fat_g: 6, category: "Rice", tags: ["turmeric", "north indian"] },

  // ── CURRIES (VEG) ─────────────────────────────
  { name: "Paneer Butter Masala", serving_size: 200, serving_unit: "g", calories: 380, protein_g: 14, carbs_g: 12, fat_g: 30, category: "Curry", tags: ["paneer", "creamy", "rich", "north indian"] },
  { name: "Palak Paneer", serving_size: 200, serving_unit: "g", calories: 280, protein_g: 14, carbs_g: 10, fat_g: 20, category: "Curry", tags: ["spinach", "paneer", "iron", "north indian"] },
  { name: "Shahi Paneer", serving_size: 200, serving_unit: "g", calories: 350, protein_g: 13, carbs_g: 14, fat_g: 28, category: "Curry", tags: ["paneer", "creamy", "mughlai"] },
  { name: "Kadai Paneer", serving_size: 200, serving_unit: "g", calories: 310, protein_g: 14, carbs_g: 10, fat_g: 24, category: "Curry", tags: ["paneer", "bell pepper", "spicy"] },
  { name: "Matar Paneer", serving_size: 200, serving_unit: "g", calories: 290, protein_g: 14, carbs_g: 18, fat_g: 18, category: "Curry", tags: ["paneer", "peas", "north indian"] },
  { name: "Dal Tadka", serving_size: 200, serving_unit: "g", calories: 180, protein_g: 10, carbs_g: 24, fat_g: 5, category: "Curry", tags: ["lentil", "tempered", "protein", "everyday"] },
  { name: "Dal Makhani", serving_size: 200, serving_unit: "g", calories: 260, protein_g: 11, carbs_g: 28, fat_g: 12, category: "Curry", tags: ["black lentil", "creamy", "punjabi"] },
  { name: "Chana Masala", serving_size: 200, serving_unit: "g", calories: 240, protein_g: 12, carbs_g: 32, fat_g: 8, category: "Curry", tags: ["chickpea", "protein", "fiber"] },
  { name: "Rajma (Kidney Bean Curry)", serving_size: 200, serving_unit: "g", calories: 250, protein_g: 13, carbs_g: 34, fat_g: 6, category: "Curry", tags: ["kidney bean", "protein", "punjabi"] },
  { name: "Aloo Gobi", serving_size: 200, serving_unit: "g", calories: 180, protein_g: 4.5, carbs_g: 22, fat_g: 8, category: "Curry", tags: ["potato", "cauliflower", "dry"] },
  { name: "Bhindi Masala", serving_size: 200, serving_unit: "g", calories: 160, protein_g: 4, carbs_g: 14, fat_g: 10, category: "Curry", tags: ["okra", "dry", "fiber"] },
  { name: "Baingan Bharta", serving_size: 200, serving_unit: "g", calories: 170, protein_g: 3.5, carbs_g: 16, fat_g: 10, category: "Curry", tags: ["eggplant", "smoky", "punjabi"] },
  { name: "Mixed Veg Curry", serving_size: 200, serving_unit: "g", calories: 190, protein_g: 5, carbs_g: 18, fat_g: 11, category: "Curry", tags: ["vegetable", "everyday"] },
  { name: "Malai Kofta", serving_size: 200, serving_unit: "g", calories: 360, protein_g: 10, carbs_g: 20, fat_g: 28, category: "Curry", tags: ["paneer", "rich", "mughlai"] },
  { name: "Sambar", serving_size: 200, serving_unit: "g", calories: 140, protein_g: 6, carbs_g: 20, fat_g: 4, category: "Curry", tags: ["lentil", "south indian", "tangy"] },
  { name: "Rasam", serving_size: 200, serving_unit: "g", calories: 60, protein_g: 2, carbs_g: 10, fat_g: 1.5, category: "Curry", tags: ["tamarind", "pepper", "south indian", "low cal"] },
  { name: "Avial", serving_size: 200, serving_unit: "g", calories: 200, protein_g: 4, carbs_g: 16, fat_g: 14, category: "Curry", tags: ["coconut", "kerala", "mixed veg"] },

  // ── CURRIES (NON-VEG) ─────────────────────────
  { name: "Butter Chicken", serving_size: 200, serving_unit: "g", calories: 390, protein_g: 28, carbs_g: 10, fat_g: 26, category: "Curry", tags: ["chicken", "creamy", "punjabi", "popular"] },
  { name: "Chicken Tikka Masala", serving_size: 200, serving_unit: "g", calories: 340, protein_g: 26, carbs_g: 12, fat_g: 22, category: "Curry", tags: ["chicken", "tikka", "rich"] },
  { name: "Chicken Korma", serving_size: 200, serving_unit: "g", calories: 350, protein_g: 24, carbs_g: 14, fat_g: 24, category: "Curry", tags: ["chicken", "mild", "mughlai"] },
  { name: "Kadai Chicken", serving_size: 200, serving_unit: "g", calories: 300, protein_g: 26, carbs_g: 8, fat_g: 18, category: "Curry", tags: ["chicken", "spicy", "bell pepper"] },
  { name: "Chicken Curry (Home Style)", serving_size: 200, serving_unit: "g", calories: 280, protein_g: 24, carbs_g: 8, fat_g: 16, category: "Curry", tags: ["chicken", "everyday", "homestyle"] },
  { name: "Egg Curry", serving_size: 200, serving_unit: "g", calories: 220, protein_g: 14, carbs_g: 8, fat_g: 14, category: "Curry", tags: ["egg", "everyday", "budget"] },
  { name: "Fish Curry (Kerala)", serving_size: 200, serving_unit: "g", calories: 240, protein_g: 22, carbs_g: 6, fat_g: 14, category: "Curry", tags: ["fish", "coconut", "kerala"] },
  { name: "Mutton Rogan Josh", serving_size: 200, serving_unit: "g", calories: 370, protein_g: 26, carbs_g: 6, fat_g: 26, category: "Curry", tags: ["mutton", "kashmiri", "rich"] },
  { name: "Keema (Minced Meat)", serving_size: 200, serving_unit: "g", calories: 320, protein_g: 24, carbs_g: 10, fat_g: 20, category: "Curry", tags: ["minced", "mutton", "spiced"] },
  { name: "Prawn Masala", serving_size: 200, serving_unit: "g", calories: 250, protein_g: 22, carbs_g: 8, fat_g: 14, category: "Curry", tags: ["prawn", "seafood", "coastal"] },

  // ── SNACKS & STREET FOOD ──────────────────────
  { name: "Samosa (Potato)", serving_size: 1, serving_unit: "piece", calories: 252, protein_g: 4.2, carbs_g: 28, fat_g: 14, category: "Snack", tags: ["fried", "potato", "street food"] },
  { name: "Pakora (Onion Bhaji)", serving_size: 4, serving_unit: "piece", calories: 200, protein_g: 4, carbs_g: 22, fat_g: 11, category: "Snack", tags: ["fried", "besan", "rainy day"] },
  { name: "Vada Pav", serving_size: 1, serving_unit: "piece", calories: 290, protein_g: 5.5, carbs_g: 38, fat_g: 13, category: "Snack", tags: ["potato", "mumbai", "street food"] },
  { name: "Pav Bhaji", serving_size: 1, serving_unit: "serving", calories: 400, protein_g: 10, carbs_g: 52, fat_g: 16, category: "Snack", tags: ["vegetable", "buttery", "mumbai"] },
  { name: "Pani Puri / Golgappa", serving_size: 6, serving_unit: "piece", calories: 180, protein_g: 3, carbs_g: 32, fat_g: 4.5, category: "Snack", tags: ["crunchy", "tangy", "street food"] },
  { name: "Bhel Puri", serving_size: 1, serving_unit: "plate", calories: 200, protein_g: 4, carbs_g: 30, fat_g: 7, category: "Snack", tags: ["puffed rice", "tangy", "mumbai"] },
  { name: "Sev Puri", serving_size: 6, serving_unit: "piece", calories: 250, protein_g: 4.5, carbs_g: 28, fat_g: 13, category: "Snack", tags: ["crunchy", "chaat", "street food"] },
  { name: "Aloo Tikki", serving_size: 2, serving_unit: "piece", calories: 220, protein_g: 4, carbs_g: 30, fat_g: 10, category: "Snack", tags: ["potato", "crispy", "north indian"] },
  { name: "Medu Vada", serving_size: 2, serving_unit: "piece", calories: 240, protein_g: 8, carbs_g: 22, fat_g: 13, category: "Snack", tags: ["urad dal", "fried", "south indian"] },
  { name: "Kachori", serving_size: 1, serving_unit: "piece", calories: 280, protein_g: 5, carbs_g: 30, fat_g: 15, category: "Snack", tags: ["fried", "stuffed", "rajasthani"] },
  { name: "Dhokla", serving_size: 4, serving_unit: "piece", calories: 160, protein_g: 5, carbs_g: 26, fat_g: 4, category: "Snack", tags: ["steamed", "besan", "gujarati"] },
  { name: "Khandvi", serving_size: 6, serving_unit: "piece", calories: 120, protein_g: 5, carbs_g: 14, fat_g: 5, category: "Snack", tags: ["besan", "gujarati", "light"] },
  { name: "Upma", serving_size: 200, serving_unit: "g", calories: 200, protein_g: 5, carbs_g: 30, fat_g: 7, category: "Snack", tags: ["semolina", "south indian", "breakfast"] },
  { name: "Poha", serving_size: 200, serving_unit: "g", calories: 180, protein_g: 3.5, carbs_g: 32, fat_g: 5, category: "Snack", tags: ["flattened rice", "light", "breakfast"] },
  { name: "Egg Bhurji", serving_size: 150, serving_unit: "g", calories: 220, protein_g: 14, carbs_g: 4, fat_g: 16, category: "Snack", tags: ["egg", "scrambled", "protein"] },

  // ── TANDOORI / GRILLED ────────────────────────
  { name: "Tandoori Chicken (Leg)", serving_size: 1, serving_unit: "piece", calories: 260, protein_g: 30, carbs_g: 4, fat_g: 14, category: "Tandoori", tags: ["chicken", "grilled", "high protein"] },
  { name: "Chicken Tikka", serving_size: 6, serving_unit: "piece", calories: 280, protein_g: 32, carbs_g: 6, fat_g: 14, category: "Tandoori", tags: ["chicken", "boneless", "high protein"] },
  { name: "Seekh Kebab", serving_size: 3, serving_unit: "piece", calories: 300, protein_g: 22, carbs_g: 6, fat_g: 20, category: "Tandoori", tags: ["minced", "grilled", "mughlai"] },
  { name: "Malai Tikka", serving_size: 6, serving_unit: "piece", calories: 320, protein_g: 28, carbs_g: 6, fat_g: 20, category: "Tandoori", tags: ["chicken", "creamy", "mild"] },
  { name: "Paneer Tikka", serving_size: 6, serving_unit: "piece", calories: 260, protein_g: 16, carbs_g: 8, fat_g: 18, category: "Tandoori", tags: ["paneer", "grilled", "vegetarian"] },
  { name: "Fish Tikka", serving_size: 4, serving_unit: "piece", calories: 220, protein_g: 26, carbs_g: 4, fat_g: 12, category: "Tandoori", tags: ["fish", "grilled", "healthy"] },
  { name: "Tandoori Roti", serving_size: 1, serving_unit: "piece", calories: 120, protein_g: 3.5, carbs_g: 20, fat_g: 3, category: "Tandoori", tags: ["bread", "clay oven"] },

  // ── DESSERTS ──────────────────────────────────
  { name: "Gulab Jamun", serving_size: 2, serving_unit: "piece", calories: 300, protein_g: 4, carbs_g: 46, fat_g: 12, category: "Dessert", tags: ["deep fried", "sweet", "festival"] },
  { name: "Rasgulla", serving_size: 2, serving_unit: "piece", calories: 186, protein_g: 4, carbs_g: 36, fat_g: 3, category: "Dessert", tags: ["cottage cheese", "syrup", "bengali"] },
  { name: "Rasmalai", serving_size: 2, serving_unit: "piece", calories: 260, protein_g: 6, carbs_g: 32, fat_g: 12, category: "Dessert", tags: ["milk", "cottage cheese", "rich"] },
  { name: "Jalebi", serving_size: 3, serving_unit: "piece", calories: 300, protein_g: 2, carbs_g: 52, fat_g: 10, category: "Dessert", tags: ["fried", "syrup", "crispy"] },
  { name: "Kheer (Rice Pudding)", serving_size: 150, serving_unit: "g", calories: 220, protein_g: 5, carbs_g: 34, fat_g: 8, category: "Dessert", tags: ["rice", "milk", "cardamom"] },
  { name: "Gajar Halwa", serving_size: 150, serving_unit: "g", calories: 280, protein_g: 4, carbs_g: 38, fat_g: 13, category: "Dessert", tags: ["carrot", "winter", "rich"] },
  { name: "Ladoo (Besan)", serving_size: 2, serving_unit: "piece", calories: 320, protein_g: 6, carbs_g: 36, fat_g: 18, category: "Dessert", tags: ["besan", "ghee", "festival"] },
  { name: "Barfi (Kaju)", serving_size: 2, serving_unit: "piece", calories: 240, protein_g: 4, carbs_g: 30, fat_g: 12, category: "Dessert", tags: ["cashew", "sweet"] },
  { name: "Payasam", serving_size: 150, serving_unit: "g", calories: 200, protein_g: 5, carbs_g: 32, fat_g: 6, category: "Dessert", tags: ["vermicelli", "milk", "south indian"] },

  // ── BEVERAGES ─────────────────────────────────
  { name: "Masala Chai", serving_size: 150, serving_unit: "ml", calories: 80, protein_g: 2, carbs_g: 12, fat_g: 2.5, category: "Beverage", tags: ["tea", "spiced", "everyday"] },
  { name: "Mango Lassi", serving_size: 250, serving_unit: "ml", calories: 240, protein_g: 6, carbs_g: 42, fat_g: 6, category: "Beverage", tags: ["mango", "yogurt", "cold"] },
  { name: "Sweet Lassi", serving_size: 250, serving_unit: "ml", calories: 200, protein_g: 6, carbs_g: 34, fat_g: 5, category: "Beverage", tags: ["yogurt", "cold", "punjabi"] },
  { name: "Buttermilk (Chaas)", serving_size: 250, serving_unit: "ml", calories: 60, protein_g: 3, carbs_g: 6, fat_g: 2, category: "Beverage", tags: ["yogurt", "digestive", "low cal"] },
  { name: "Nimbu Pani (Lemonade)", serving_size: 250, serving_unit: "ml", calories: 50, protein_g: 0.5, carbs_g: 12, fat_g: 0, category: "Beverage", tags: ["lemon", "refreshing", "low cal"] },
  { name: "Badam Milk", serving_size: 250, serving_unit: "ml", calories: 220, protein_g: 8, carbs_g: 28, fat_g: 9, category: "Beverage", tags: ["almond", "milk", "nutritious"] },
  { name: "Thandai", serving_size: 250, serving_unit: "ml", calories: 280, protein_g: 7, carbs_g: 36, fat_g: 12, category: "Beverage", tags: ["nuts", "spiced", "festival"] },
  { name: "Filter Coffee", serving_size: 150, serving_unit: "ml", calories: 90, protein_g: 2, carbs_g: 10, fat_g: 4, category: "Beverage", tags: ["coffee", "south indian", "milk"] },

  // ── CHUTNEYS / ACCOMPANIMENTS ────────────────
  { name: "Raita (Cucumber)", serving_size: 100, serving_unit: "g", calories: 65, protein_g: 3, carbs_g: 6, fat_g: 3, category: "Side", tags: ["yogurt", "cooling", "side"] },
  { name: "Boondi Raita", serving_size: 100, serving_unit: "g", calories: 90, protein_g: 3.5, carbs_g: 10, fat_g: 4, category: "Side", tags: ["yogurt", "besan", "side"] },
  { name: "Pickle (Mango)", serving_size: 15, serving_unit: "g", calories: 25, protein_g: 0.3, carbs_g: 3, fat_g: 1.5, category: "Side", tags: ["fermented", "tangy", "condiment"] },
  { name: "Papad (Roasted)", serving_size: 1, serving_unit: "piece", calories: 40, protein_g: 2, carbs_g: 6, fat_g: 1, category: "Side", tags: ["lentil", "crunchy", "side"] },
  { name: "Green Chutney (Mint)", serving_size: 30, serving_unit: "g", calories: 15, protein_g: 0.5, carbs_g: 2, fat_g: 0.5, category: "Side", tags: ["mint", "coriander", "low cal"] },
  { name: "Coconut Chutney", serving_size: 30, serving_unit: "g", calories: 55, protein_g: 1, carbs_g: 3, fat_g: 4.5, category: "Side", tags: ["coconut", "south indian"] },
  { name: "Dal (Boiled, Plain)", serving_size: 200, serving_unit: "g", calories: 160, protein_g: 10, carbs_g: 24, fat_g: 2, category: "Side", tags: ["lentil", "protein", "low fat"] },

  // ── COMPLETE MEALS / THALIS ───────────────────
  { name: "Chole Bhature", serving_size: 1, serving_unit: "serving", calories: 560, protein_g: 16, carbs_g: 68, fat_g: 24, category: "Meal", tags: ["chickpea", "fried bread", "punjabi"] },
  { name: "Thali (North Indian Veg)", serving_size: 1, serving_unit: "plate", calories: 700, protein_g: 20, carbs_g: 90, fat_g: 28, category: "Meal", tags: ["complete meal", "balanced"] },
  { name: "Thali (South Indian Veg)", serving_size: 1, serving_unit: "plate", calories: 650, protein_g: 18, carbs_g: 95, fat_g: 22, category: "Meal", tags: ["rice", "sambar", "rasam", "balanced"] },
  { name: "Chicken Fried Rice", serving_size: 250, serving_unit: "g", calories: 380, protein_g: 18, carbs_g: 48, fat_g: 14, category: "Rice", tags: ["chicken", "indo-chinese"] },
  { name: "Egg Fried Rice", serving_size: 250, serving_unit: "g", calories: 340, protein_g: 12, carbs_g: 50, fat_g: 11, category: "Rice", tags: ["egg", "indo-chinese"] },
  { name: "Chicken Momos", serving_size: 6, serving_unit: "piece", calories: 280, protein_g: 16, carbs_g: 30, fat_g: 10, category: "Snack", tags: ["dumpling", "steamed", "tibetan"] },
  { name: "Veg Momos", serving_size: 6, serving_unit: "piece", calories: 220, protein_g: 6, carbs_g: 32, fat_g: 8, category: "Snack", tags: ["dumpling", "steamed", "vegetarian"] },
];

/**
 * Search the Indian food library by name or tags
 */
export function searchIndianFoods(query: string): IndianFood[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];

  return INDIAN_FOODS.filter((food) => {
    const nameMatch = food.name.toLowerCase().includes(q);
    const tagMatch = food.tags.some((t) => t.includes(q));
    const catMatch = food.category.toLowerCase().includes(q);
    return nameMatch || tagMatch || catMatch;
  }).slice(0, 20);
}
