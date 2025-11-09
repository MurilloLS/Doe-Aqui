const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    pname: String,
    pdesc: String,
    category: String,
    pimage: String,
    pimage2: String,
    addedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Users' },
    pLoc: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number]
        }
    },
    listing_type: String
});

productSchema.index({ pLoc: '2dsphere' });

const Products = mongoose.model('Products', productSchema);

module.exports = Products;