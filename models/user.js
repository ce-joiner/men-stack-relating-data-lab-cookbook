const mongoose = require('mongoose');


const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    enum: ['Vegetable', 'Fruit', 'Dairy', 'Grain', 'Protein', 'Spices', 'Other'],
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  unit: {
    type: String,
    enum: ['kg', 'g', 'lbs', 'oz', 'liters', 'ml', 'pieces'],
    required: true
  },
  expirationDate: {
    type: Date
  },
  addedDate: {
    type: Date,
    default: Date.now
  },
  notes: {
    type: String,
    default: "No notes provided"
  }
});



const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  pantry: [foodSchema],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
