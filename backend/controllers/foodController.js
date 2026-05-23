// Static food database with nutritional info
const foodDatabase = [
  { id: 1, name: 'Apple', category: 'Fruits', calories: 52, protein: 0.3, carbs: 14, fat: 0.2, sugar: 10, fiber: 2.4, unit: '100g' },
  { id: 2, name: 'Banana', category: 'Fruits', calories: 89, protein: 1.1, carbs: 23, fat: 0.3, sugar: 12, fiber: 2.6, unit: '100g' },
  { id: 3, name: 'Orange', category: 'Fruits', calories: 47, protein: 0.9, carbs: 12, fat: 0.1, sugar: 9.4, fiber: 2.4, unit: '100g' },
  { id: 4, name: 'Grapes', category: 'Fruits', calories: 69, protein: 0.7, carbs: 18, fat: 0.2, sugar: 15, fiber: 0.9, unit: '100g' },
  { id: 5, name: 'Strawberries', category: 'Fruits', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, sugar: 4.9, fiber: 2, unit: '100g' },
  { id: 6, name: 'Mango', category: 'Fruits', calories: 60, protein: 0.8, carbs: 15, fat: 0.4, sugar: 13.7, fiber: 1.6, unit: '100g' },
  { id: 7, name: 'Chicken Breast', category: 'Proteins', calories: 165, protein: 31, carbs: 0, fat: 3.6, sugar: 0, fiber: 0, unit: '100g' },
  { id: 8, name: 'Salmon', category: 'Proteins', calories: 208, protein: 20, carbs: 0, fat: 13, sugar: 0, fiber: 0, unit: '100g' },
  { id: 9, name: 'Tuna (canned)', category: 'Proteins', calories: 116, protein: 26, carbs: 0, fat: 0.5, sugar: 0, fiber: 0, unit: '100g' },
  { id: 10, name: 'Eggs', category: 'Proteins', calories: 155, protein: 13, carbs: 1.1, fat: 11, sugar: 1.1, fiber: 0, unit: '100g' },
  { id: 11, name: 'Tofu', category: 'Proteins', calories: 76, protein: 8, carbs: 1.9, fat: 4.8, sugar: 0.6, fiber: 0.3, unit: '100g' },
  { id: 12, name: 'Greek Yogurt', category: 'Dairy', calories: 59, protein: 10, carbs: 3.6, fat: 0.4, sugar: 3.2, fiber: 0, unit: '100g' },
  { id: 13, name: 'Milk (whole)', category: 'Dairy', calories: 61, protein: 3.2, carbs: 4.8, fat: 3.3, sugar: 5.1, fiber: 0, unit: '100ml' },
  { id: 14, name: 'Cheddar Cheese', category: 'Dairy', calories: 403, protein: 25, carbs: 1.3, fat: 33, sugar: 0.5, fiber: 0, unit: '100g' },
  { id: 15, name: 'Brown Rice', category: 'Grains', calories: 216, protein: 5, carbs: 45, fat: 1.8, sugar: 0.7, fiber: 3.5, unit: '100g cooked' },
  { id: 16, name: 'White Rice', category: 'Grains', calories: 206, protein: 4.3, carbs: 45, fat: 0.4, sugar: 0.1, fiber: 0.6, unit: '100g cooked' },
  { id: 17, name: 'Oats', category: 'Grains', calories: 389, protein: 17, carbs: 66, fat: 7, sugar: 1.1, fiber: 10.6, unit: '100g' },
  { id: 18, name: 'Whole Wheat Bread', category: 'Grains', calories: 247, protein: 13, carbs: 41, fat: 3.4, sugar: 6, fiber: 6, unit: '100g' },
  { id: 19, name: 'Pasta', category: 'Grains', calories: 371, protein: 13, carbs: 75, fat: 1.5, sugar: 2.7, fiber: 3.2, unit: '100g dry' },
  { id: 20, name: 'Quinoa', category: 'Grains', calories: 222, protein: 8, carbs: 39, fat: 3.5, sugar: 1.6, fiber: 5, unit: '100g cooked' },
  { id: 21, name: 'Broccoli', category: 'Vegetables', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, sugar: 1.7, fiber: 2.6, unit: '100g' },
  { id: 22, name: 'Spinach', category: 'Vegetables', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, sugar: 0.4, fiber: 2.2, unit: '100g' },
  { id: 23, name: 'Carrot', category: 'Vegetables', calories: 41, protein: 0.9, carbs: 10, fat: 0.2, sugar: 4.7, fiber: 2.8, unit: '100g' },
  { id: 24, name: 'Sweet Potato', category: 'Vegetables', calories: 86, protein: 1.6, carbs: 20, fat: 0.1, sugar: 4.2, fiber: 3, unit: '100g' },
  { id: 25, name: 'Avocado', category: 'Vegetables', calories: 160, protein: 2, carbs: 9, fat: 15, sugar: 0.7, fiber: 7, unit: '100g' },
  { id: 26, name: 'Tomato', category: 'Vegetables', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, sugar: 2.6, fiber: 1.2, unit: '100g' },
  { id: 27, name: 'Almonds', category: 'Nuts & Seeds', calories: 579, protein: 21, carbs: 22, fat: 50, sugar: 4.4, fiber: 12.5, unit: '100g' },
  { id: 28, name: 'Walnuts', category: 'Nuts & Seeds', calories: 654, protein: 15, carbs: 14, fat: 65, sugar: 2.6, fiber: 6.7, unit: '100g' },
  { id: 29, name: 'Peanut Butter', category: 'Nuts & Seeds', calories: 588, protein: 25, carbs: 20, fat: 50, sugar: 9, fiber: 6, unit: '100g' },
  { id: 30, name: 'Olive Oil', category: 'Oils & Fats', calories: 884, protein: 0, carbs: 0, fat: 100, sugar: 0, fiber: 0, unit: '100ml' },
  { id: 31, name: 'Lentils', category: 'Legumes', calories: 116, protein: 9, carbs: 20, fat: 0.4, sugar: 1.8, fiber: 7.9, unit: '100g cooked' },
  { id: 32, name: 'Chickpeas', category: 'Legumes', calories: 164, protein: 8.9, carbs: 27, fat: 2.6, sugar: 4.8, fiber: 7.6, unit: '100g cooked' },
  { id: 33, name: 'Black Beans', category: 'Legumes', calories: 132, protein: 8.9, carbs: 24, fat: 0.5, sugar: 0.3, fiber: 8.7, unit: '100g cooked' },
  { id: 34, name: 'Orange Juice', category: 'Beverages', calories: 45, protein: 0.7, carbs: 10, fat: 0.2, sugar: 8.4, fiber: 0.2, unit: '100ml' },
  { id: 35, name: 'Coffee (black)', category: 'Beverages', calories: 2, protein: 0.3, carbs: 0, fat: 0, sugar: 0, fiber: 0, unit: '100ml' },
  { id: 36, name: 'Pizza (cheese)', category: 'Fast Food', calories: 266, protein: 11, carbs: 33, fat: 10, sugar: 3.6, fiber: 2.3, unit: '100g' },
  { id: 37, name: 'Hamburger', category: 'Fast Food', calories: 295, protein: 17, carbs: 24, fat: 14, sugar: 5, fiber: 1, unit: '100g' },
  { id: 38, name: 'French Fries', category: 'Fast Food', calories: 312, protein: 3.4, carbs: 41, fat: 15, sugar: 0.3, fiber: 3.8, unit: '100g' },
  { id: 39, name: 'Dark Chocolate', category: 'Sweets', calories: 546, protein: 5, carbs: 60, fat: 31, sugar: 48, fiber: 7, unit: '100g' },
  { id: 40, name: 'Ice Cream', category: 'Sweets', calories: 207, protein: 3.5, carbs: 24, fat: 11, sugar: 21, fiber: 0.7, unit: '100g' },
];

exports.searchFood = async (req, res) => {
  try {
    const { q, category } = req.query;
    let results = foodDatabase;

    if (q) {
      results = results.filter(f => f.name.toLowerCase().includes(q.toLowerCase()));
    }
    if (category) {
      results = results.filter(f => f.category === category);
    }

    res.json({ success: true, foods: results.slice(0, 20), total: results.length });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getFoodById = async (req, res) => {
  try {
    const food = foodDatabase.find(f => f.id === parseInt(req.params.id));
    if (!food) return res.status(404).json({ success: false, message: 'Food not found' });
    res.json({ success: true, food });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  const categories = [...new Set(foodDatabase.map(f => f.category))];
  res.json({ success: true, categories });
};
