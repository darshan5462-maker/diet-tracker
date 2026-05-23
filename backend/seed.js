const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const User = require('./models/User');
const Meal = require('./models/Meal');
const DietPlan = require('./models/DietPlan');
const Water = require('./models/Water');
const BMI = require('./models/BMI');
const Notification = require('./models/Notification');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/diet-tracker';

const seedData = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Promise.all([
      User.deleteMany({}), Meal.deleteMany({}), DietPlan.deleteMany({}),
      Water.deleteMany({}), BMI.deleteMany({}), Notification.deleteMany({})
    ]);
    console.log('🗑️  Cleared existing data');

    // Create Users
    const adminUser = await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'demo1234',
      role: 'admin',
      isActive: true
    });

    const doctorUser = await User.create({
      name: 'Dr. Sarah Johnson',
      email: 'doctor@demo.com',
      password: 'demo1234',
      role: 'doctor',
      specialization: 'Nutritionist & Dietitian',
      licenseNumber: 'ND-2024-001',
      isActive: true
    });

    const patientUser = await User.create({
      name: 'John Smith',
      email: 'patient@demo.com',
      password: 'demo1234',
      role: 'patient',
      gender: 'male',
      dateOfBirth: new Date('1990-05-15'),
      height: 175,
      weight: 80,
      targetWeight: 72,
      activityLevel: 'moderately_active',
      goal: 'lose_weight',
      dailyCalorieGoal: 1800,
      dailyWaterGoal: 8,
      assignedDoctor: doctorUser._id,
      isActive: true
    });

    const patient2 = await User.create({
      name: 'Emma Davis',
      email: 'emma@demo.com',
      password: 'demo1234',
      role: 'patient',
      gender: 'female',
      dateOfBirth: new Date('1995-08-22'),
      height: 162,
      weight: 58,
      targetWeight: 60,
      activityLevel: 'lightly_active',
      goal: 'gain_weight',
      dailyCalorieGoal: 2200,
      dailyWaterGoal: 7,
      assignedDoctor: doctorUser._id,
      isActive: true
    });

    // Update doctor with patients
    await User.findByIdAndUpdate(doctorUser._id, {
      patients: [patientUser._id, patient2._id]
    });

    console.log('👤 Users created');

    // Create Meals for patient (last 7 days)
    const mealTemplates = [
      {
        mealType: 'breakfast', name: 'Oatmeal with Berries',
        foods: [
          { name: 'Oats', quantity: 80, unit: 'g', calories: 311, protein: 14, carbs: 53, fat: 5.6, sugar: 0.9 },
          { name: 'Strawberries', quantity: 100, unit: 'g', calories: 32, protein: 0.7, carbs: 7.7, fat: 0.3, sugar: 4.9 },
          { name: 'Milk (whole)', quantity: 200, unit: 'ml', calories: 122, protein: 6.4, carbs: 9.6, fat: 6.6, sugar: 10.2 }
        ]
      },
      {
        mealType: 'lunch', name: 'Grilled Chicken Salad',
        foods: [
          { name: 'Chicken Breast', quantity: 150, unit: 'g', calories: 248, protein: 46.5, carbs: 0, fat: 5.4, sugar: 0 },
          { name: 'Spinach', quantity: 100, unit: 'g', calories: 23, protein: 2.9, carbs: 3.6, fat: 0.4, sugar: 0.4 },
          { name: 'Tomato', quantity: 100, unit: 'g', calories: 18, protein: 0.9, carbs: 3.9, fat: 0.2, sugar: 2.6 }
        ]
      },
      {
        mealType: 'dinner', name: 'Salmon with Sweet Potato',
        foods: [
          { name: 'Salmon', quantity: 200, unit: 'g', calories: 416, protein: 40, carbs: 0, fat: 26, sugar: 0 },
          { name: 'Sweet Potato', quantity: 150, unit: 'g', calories: 129, protein: 2.4, carbs: 30, fat: 0.15, sugar: 6.3 },
          { name: 'Broccoli', quantity: 100, unit: 'g', calories: 34, protein: 2.8, carbs: 7, fat: 0.4, sugar: 1.7 }
        ]
      },
      {
        mealType: 'snack', name: 'Greek Yogurt with Almonds',
        foods: [
          { name: 'Greek Yogurt', quantity: 150, unit: 'g', calories: 89, protein: 15, carbs: 5.4, fat: 0.6, sugar: 4.8 },
          { name: 'Almonds', quantity: 30, unit: 'g', calories: 174, protein: 6.3, carbs: 6.6, fat: 15, sugar: 1.3 }
        ]
      }
    ];

    for (let day = 6; day >= 0; day--) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      date.setHours(8, 0, 0, 0);

      for (const template of mealTemplates) {
        const totalCalories = template.foods.reduce((s, f) => s + f.calories, 0);
        const totalProtein = template.foods.reduce((s, f) => s + f.protein, 0);
        const totalCarbs = template.foods.reduce((s, f) => s + f.carbs, 0);
        const totalFat = template.foods.reduce((s, f) => s + f.fat, 0);

        await Meal.create({
          user: patientUser._id,
          ...template,
          date: new Date(date),
          totalCalories,
          totalProtein,
          totalCarbs,
          totalFat,
          totalSugar: template.foods.reduce((s, f) => s + (f.sugar || 0), 0)
        });
      }
    }
    console.log('🍽️  Meals seeded');

    // Water tracking for last 7 days
    for (let day = 6; day >= 0; day--) {
      const date = new Date();
      date.setDate(date.getDate() - day);
      const glasses = 5 + Math.floor(Math.random() * 5);
      await Water.create({
        user: patientUser._id,
        date,
        glasses,
        mlAmount: glasses * 250,
        goal: 8,
        entries: Array.from({ length: glasses }, (_, i) => ({
          amount: 1, unit: 'glasses',
          time: new Date(date.setHours(7 + i * 2))
        }))
      });
    }
    console.log('💧 Water data seeded');

    // BMI history
    const bmiRecords = [
      { weight: 83, height: 175, date: new Date(Date.now() - 60 * 86400000) },
      { weight: 81.5, height: 175, date: new Date(Date.now() - 30 * 86400000) },
      { weight: 80, height: 175, date: new Date() }
    ];

    for (const rec of bmiRecords) {
      const bmi = rec.weight / Math.pow(rec.height / 100, 2);
      const bmiRounded = Math.round(bmi * 10) / 10;
      let category;
      if (bmiRounded < 18.5) category = 'Underweight';
      else if (bmiRounded < 25) category = 'Normal weight';
      else if (bmiRounded < 30) category = 'Overweight';
      else category = 'Obese';

      await BMI.create({ user: patientUser._id, ...rec, bmi: bmiRounded, category });
    }
    console.log('⚖️  BMI data seeded');

    // Diet Plan
    const dietPlan = await DietPlan.create({
      title: '30-Day Weight Loss Plan',
      description: 'A balanced calorie-deficit plan designed to promote healthy weight loss while maintaining muscle mass.',
      createdBy: doctorUser._id,
      assignedTo: patientUser._id,
      startDate: new Date(),
      endDate: new Date(Date.now() + 30 * 86400000),
      totalCalories: 1800,
      goals: 'Lose 4-5kg in 30 days through sustainable caloric deficit and balanced nutrition.',
      status: 'active',
      meals: [
        {
          mealType: 'breakfast',
          time: '07:30',
          notes: 'High protein breakfast to kickstart metabolism',
          foods: [
            { name: 'Oats', quantity: 60, unit: 'g', calories: 233, protein: 10, carbs: 40, fat: 4 },
            { name: 'Banana', quantity: 100, unit: 'g', calories: 89, protein: 1.1, carbs: 23, fat: 0.3 },
            { name: 'Greek Yogurt', quantity: 150, unit: 'g', calories: 89, protein: 15, carbs: 5.4, fat: 0.6 }
          ]
        },
        {
          mealType: 'lunch',
          time: '13:00',
          notes: 'Lean protein with complex carbs',
          foods: [
            { name: 'Chicken Breast', quantity: 150, unit: 'g', calories: 248, protein: 46, carbs: 0, fat: 5 },
            { name: 'Brown Rice', quantity: 150, unit: 'g', calories: 324, protein: 7.5, carbs: 67, fat: 2.7 },
            { name: 'Broccoli', quantity: 150, unit: 'g', calories: 51, protein: 4.2, carbs: 10.5, fat: 0.6 }
          ]
        },
        {
          mealType: 'snack',
          time: '16:00',
          notes: 'Light nutritious snack',
          foods: [
            { name: 'Apple', quantity: 150, unit: 'g', calories: 78, protein: 0.5, carbs: 21, fat: 0.3 },
            { name: 'Almonds', quantity: 20, unit: 'g', calories: 116, protein: 4.2, carbs: 4.4, fat: 10 }
          ]
        },
        {
          mealType: 'dinner',
          time: '19:30',
          notes: 'Light dinner, avoid heavy carbs after 7pm',
          foods: [
            { name: 'Salmon', quantity: 150, unit: 'g', calories: 312, protein: 30, carbs: 0, fat: 19.5 },
            { name: 'Spinach', quantity: 200, unit: 'g', calories: 46, protein: 5.8, carbs: 7.2, fat: 0.8 },
            { name: 'Sweet Potato', quantity: 100, unit: 'g', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 }
          ]
        }
      ],
      nutritionalAdvice: [
        'Drink at least 8 glasses of water daily, especially before meals',
        'Eat slowly and mindfully — put down your fork between bites',
        'Avoid processed sugars and refined carbohydrates',
        'Include at least 25-30g of fiber daily from vegetables and whole grains',
        'Do not skip breakfast — it sets your metabolism for the day',
        'Have your last meal at least 2 hours before bedtime'
      ],
      restrictions: [
        'No added sugar or sugary drinks',
        'Avoid fried foods and fast food',
        'Limit alcohol to maximum 1 drink per week',
        'Avoid processed snacks and chips'
      ]
    });

    // Notifications
    await Notification.create([
      {
        user: patientUser._id,
        title: 'New Diet Plan Assigned',
        message: `Dr. Sarah Johnson has assigned you a new diet plan: "30-Day Weight Loss Plan"`,
        type: 'diet_update',
        link: `/patient/diet-plan/${dietPlan._id}`,
        isRead: false
      },
      {
        user: patientUser._id,
        title: '🎉 Goal Achievement!',
        message: 'Congratulations! You\'ve logged meals for 7 consecutive days. Keep it up!',
        type: 'goal_achieved',
        isRead: false
      },
      {
        user: patientUser._id,
        title: '💧 Hydration Reminder',
        message: 'You\'re halfway through the day. Have you had enough water? Aim for 8 glasses!',
        type: 'water_reminder',
        isRead: true
      },
      {
        user: doctorUser._id,
        title: 'Patient Progress Update',
        message: 'John Smith has lost 3kg this month. Review his progress in the patient dashboard.',
        type: 'system',
        isRead: false
      }
    ]);

    console.log('🔔 Notifications seeded');
    console.log('\n✅ Database seeded successfully!\n');
    console.log('='.repeat(50));
    console.log('📋 Demo Credentials:');
    console.log('  Patient : patient@demo.com / demo1234');
    console.log('  Doctor  : doctor@demo.com  / demo1234');
    console.log('  Admin   : admin@demo.com   / demo1234');
    console.log('='.repeat(50));

    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error);
    process.exit(1);
  }
};

seedData();
