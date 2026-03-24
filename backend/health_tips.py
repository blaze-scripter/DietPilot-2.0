"""Health tips database for common conditions."""

HEALTH_TIPS_DB = {
    "diabetes": [
        {"title": "Choose Complex Carbs", "text": "Opt for whole grains, brown rice, and millets over refined carbs. They have a lower glycemic index.", "type": "tip", "icon": "🌾"},
        {"title": "Monitor Portion Sizes", "text": "Use smaller plates and measure servings to keep blood sugar stable throughout the day.", "type": "tip", "icon": "🍽️"},
        {"title": "Avoid Sugary Drinks", "text": "Sodas, fruit juices, and sweetened beverages cause rapid blood sugar spikes.", "type": "dont", "icon": "🥤"},
        {"title": "Include Fiber", "text": "High-fiber foods like vegetables, dal, and oats slow down sugar absorption.", "type": "tip", "icon": "🥦"},
        {"title": "Skip Fried Snacks", "text": "Samosas, pakoras, and chips add empty calories and worsen insulin resistance.", "type": "dont", "icon": "🍟"},
        {"title": "Eat at Regular Times", "text": "Consistent meal timing helps maintain steady blood sugar levels.", "type": "tip", "icon": "⏰"},
    ],
    "hypertension": [
        {"title": "Reduce Salt Intake", "text": "Limit sodium to under 2300mg/day. Avoid pickles, papad, and processed foods.", "type": "tip", "icon": "🧂"},
        {"title": "Eat Potassium-Rich Foods", "text": "Bananas, coconut water, and leafy greens help counteract sodium effects.", "type": "tip", "icon": "🍌"},
        {"title": "Avoid Processed Meats", "text": "Sausages, bacon, and canned meats are extremely high in sodium.", "type": "dont", "icon": "🥓"},
        {"title": "Limit Caffeine", "text": "Excessive tea/coffee can temporarily raise blood pressure.", "type": "dont", "icon": "☕"},
        {"title": "Include Garlic", "text": "Garlic has natural blood pressure-lowering properties. Add it to your cooking.", "type": "tip", "icon": "🧄"},
    ],
    "PCOS": [
        {"title": "Low Glycemic Diet", "text": "Choose foods that don't spike insulin — whole grains, legumes, non-starchy vegetables.", "type": "tip", "icon": "📊"},
        {"title": "Anti-Inflammatory Foods", "text": "Include turmeric, ginger, leafy greens, and fatty fish to reduce inflammation.", "type": "tip", "icon": "🌿"},
        {"title": "Avoid Refined Sugar", "text": "Sweets, white bread, and pastries worsen insulin resistance in PCOS.", "type": "dont", "icon": "🍰"},
        {"title": "Healthy Fats", "text": "Include nuts, seeds, avocado, and olive oil for hormonal balance.", "type": "tip", "icon": "🥑"},
        {"title": "Skip Dairy (if sensitive)", "text": "Some women with PCOS find that reducing dairy improves symptoms.", "type": "dont", "icon": "🥛"},
    ],
    "high_cholesterol": [
        {"title": "Increase Soluble Fiber", "text": "Oats, beans, lentils, and fruits help lower LDL cholesterol levels.", "type": "tip", "icon": "🥣"},
        {"title": "Choose Healthy Fats", "text": "Replace saturated fats with olive oil, nuts, and seeds.", "type": "tip", "icon": "🫒"},
        {"title": "Avoid Trans Fats", "text": "Vanaspati, margarine, and commercially fried foods contain harmful trans fats.", "type": "dont", "icon": "⚠️"},
        {"title": "Eat Fatty Fish", "text": "Omega-3 rich fish like salmon and mackerel help raise HDL (good) cholesterol.", "type": "tip", "icon": "🐟"},
        {"title": "Limit Red Meat", "text": "Red meat is high in saturated fat which raises LDL cholesterol.", "type": "dont", "icon": "🥩"},
    ],
    "thyroid": [
        {"title": "Get Enough Iodine", "text": "Use iodized salt and include seafood for proper thyroid function.", "type": "tip", "icon": "🧂"},
        {"title": "Selenium-Rich Foods", "text": "Brazil nuts, eggs, and sunflower seeds support thyroid hormone production.", "type": "tip", "icon": "🥚"},
        {"title": "Limit Raw Cruciferous", "text": "Raw cabbage, broccoli, and cauliflower may interfere with thyroid. Cook them instead.", "type": "dont", "icon": "🥬"},
        {"title": "Avoid Soy in Excess", "text": "Large amounts of soy products may interfere with thyroid medication absorption.", "type": "dont", "icon": "🫘"},
        {"title": "Include Zinc", "text": "Pumpkin seeds, chickpeas, and cashews provide zinc needed for thyroid hormone synthesis.", "type": "tip", "icon": "🎃"},
    ],
}


def get_tips_for_condition(condition: str) -> list:
    return HEALTH_TIPS_DB.get(condition, [])
