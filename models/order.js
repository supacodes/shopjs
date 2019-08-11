const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    products: {
        proudct: {
            type: Object,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        }
    },
    user: {
        username: {
            type: String,
            required: true
        },
        id: {
            type: Schema.Types.ObjectId,
            required: true,
            ref: 'User'
        }
    },
    date: {
        default: Date.now,
        type: Date
    }
});


module.exports = mongoose.model('Order', orderSchema);