const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const uri = "mongodb+srv://node:bVarJkbh4P3zhCBR@nodejs-cs7gj.mongodb.net/shop?retryWrites=true&w=majority";

let _db;

const mongoConnect = callback => {
	MongoClient.connect(uri, {useUnifiedTopology: true, useNewUrlParser: true })
	.then(client => {
      console.log('Connected!');
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }
  throw 'No database found!';
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;

// const MongoClient = require('mongodb').MongoClient;
// const uri = "mongodb+srv://node:bVarJkbh4P3zhCBR@nodejs-cs7gj.mongodb.net/test?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true });
// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   client.close();
// });
