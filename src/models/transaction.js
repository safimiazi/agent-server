const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  // Customer ID of the transaction (required)
  customerId: { type: String, required: true },

  // Translation number of the transaction (required)
  transectionNumber: { type: String },

  // Amount of the transaction (required)
  amount:{ type: Number, required: true },

  // Payment type used for the transaction (required)
  paymentType: { type: String, required: true },

  // Order ID associated with the transaction (required)
  orderId: { type: String, required: true },

  // Points earned or used in the transaction (required)
  points: { type: Number, required: true },

  // Translation type of the transaction (required)
  trans: { type: String,  },

  // Phone number associated with the transaction (required)
  number: { type: String,  },
  
  // transationType  condtion the data list 
  transationType: {type:String},
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 5356800  // 62 days in milliseconds
  }
});

// Create a Mongoose model based on the schema
const transactioListItem = mongoose.model('transaction', transactionSchema);

// Export the Tra
module.exports = {transactioListItem}
