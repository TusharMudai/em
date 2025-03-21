const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Please provide a name'] 
    },
    email: { 
        type: String, 
        required: [true, 'Please provide an email'], 
        unique: true 
    },
    password: { 
        type: String, 
        required: [true, 'Please provide a password'] 
    },
    position: { 
        type: String, 
        required: [true, 'Please provide the employee\'s position'] 
    },
    department: { 
        type: String, 
        required: [true, 'Please provide the employee\'s department'] 
    },
    salary: { 
        type: Number, 
        required: [true, 'Please provide the employee\'s salary'] 
    },
    joiningDate: { 
        type: Date, 
        required: [true, 'Please provide the employee\'s joining date'] 
    },
}, { 
    timestamps: true // Automatically adds `createdAt` and `updatedAt` fields
});

module.exports = mongoose.model('User', userSchema);