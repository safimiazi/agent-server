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
  trans: { type: String, required: true },

  // Phone number associated with the transaction (required)
  number: { type: String, required: true }
}, {
  // Enable timestamps for createdAt and updatedAt fields
  timestamps: { createdAt: 'createdAt' }
});


// Create an index on the createdAt field for automatic expiration
transactionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 2592000 });

// Create a Mongoose model based on the schema
const transactioListItem = mongoose.model('transaction', transactionSchema);

// Export the Tra
module.exports = {transactioListItem}
