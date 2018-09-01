'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var TestSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  Created_date: {
    type: Date,
    default: Date.now
  },
  status: {
    type: [{
      type: String,
      enum: ['pending', 'ongoing', 'completed']
    }],
    default: ['pending']
  }
});

module.exports = mongoose.model('Tests', TestSchema);
