const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "Username is required"],
      unique: true,
      lowercase: true,
      trim: true, // Remove whitespace
      minlength: [3, "Username must be at least 3 characters"],
      maxlength: [20, "Username cannot exceed 20 characters"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const newUser = new User({ 
    username: "JohnDoe", 
    password: "mypassword123" 
});
await newUser.save(); // Password gets hashed automatically


const user = await User.findOne({ username: "johndoe" }); // lowercase works
const isValid = await user.comparePassword("mypassword123");


//MIDDLEWARE
// Your current approach is great, but here's a small optimization:
userSchema.pre('save', async function(next) {
    try {
        // Only hash if password is modified (prevents re-hashing on updates)
        if (!this.isModified('password')) return next();
        
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});


userSchema.methods.comparePassword = async function(Password) {
    try {
    return await bcrypt.compare(Password, this.password);
    } catch (error) {
        throw new Error('Error comparing passwords');
    }
};

const User = mongoose.model('User', userSchema);
module.exports = User;