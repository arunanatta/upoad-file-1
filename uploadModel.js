const mongoose = require('mongoose');
const fs = require('fs');
mongoose.connect('mongodb://Sweety:sweety1129@cluster0-shard-00-00-ojcxp.mongodb.net:27017,cluster0-shard-00-01-ojcxp.mongodb.net:27017,cluster0-shard-00-02-ojcxp.mongodb.net:27017/BankSystem?ssl=true&replicaSet=Cluster0-shard-0&authSource=admin&retryWrites=true');
const Schema = mongoose.Schema;

mongoose.set('useCreateIndex', true);

let uploadSchema = new Schema({
    name: {
      type: String,
    },
    mimetype: {
      type: String,
    },
    size: {
      type: Number,
    },
    base64: {
      type: String,
    }
});

module.exports = mongoose.model('upload',uploadSchema);

module.exports.base64_encode = function(file) {
  return new Promise((resolve, reject) => {
    if(file == undefined){
      reject('no file found');
    } else {
      let encodedData = fs.readFileSync(file, 'base64');
      fs.unlink(file);
      resolve(encodedData.toString('base64'));
    }
  })
} 