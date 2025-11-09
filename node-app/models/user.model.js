const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    user_type: { type: String, enum: ['INDIVIDUAL', 'NGO', 'COMPANY'], required: true },
    username: { type: String, required: true },
    mobile: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    document: { type: String, unique: true, sparse: true },
    location_city: String,
    location_state: String,
    profilePic: String,
    created_at: { type: Date, default: Date.now },
    likedProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Products' }]
});

const Users = mongoose.model('Users', UserSchema);

module.exports = Users;