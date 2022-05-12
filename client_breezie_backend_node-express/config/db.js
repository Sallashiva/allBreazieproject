const mongoose = require('mongoose');

module.exports.mongoConnection = mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err => {
    if (!err) {
        console.log('Database Connected Successfully');
    } else {
        console.log('Error in Connecting Mongodb', err);
    }
})

// const MongoClient = require('mongodb').MongoClient;
// fs = require('fs');
// var ca = [fs.readFileSync("./config/rds-combined-ca-bundle.pem")];

// //Create a MongoDB client, open a connection to Amazon DocumentDB as a replica set,
// //  and specify the read preference as secondary preferred
// module.exports.mongoConnection = MongoClient.connect(
//     `mongodb://teadmin:management@breezie-prod.ccu53rkjabov.ap-south-1.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=${ca}&retryWrites=false`, {
        
//     },  err => {
//     if (!err) {
//         console.log('Database Connected Successfully');
//     } else {
//         console.log('Error in Connecting Mongodb', err);
//     }
// })



// var MongoClient = require('mongodb').MongoClient

// //Create a MongoDB client, open a connection to DocDB; as a replica set,
// //  and specify the read preference as secondary preferred

// var client = MongoClient.connect(
// 'mongodb://teadmin:management@breezie-prod.cluster-ccu53rkjabov.ap-south-1.docdb.amazonaws.com:27017/?ssl=true&ssl_ca_certs=rds-combined-ca-bundle.pem&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false',
// {
//   tlsCAFile: `rds-combined-ca-bundle.pem` //Specify the DocDB; cert
// },
// function(err, client) {
//     if(err)
//         throw err;

//     //Specify the database to be used
//     db = client.db('myFirstDatabase');

//     //Specify the collection to be used
//     // col = db.collection('sample-collection');

//     //Insert a single document
// //     col.insertOne({'hello':'Amazon DocumentDB'}, function(err, result){
// //       //Find the document that was previously written
// //       col.findOne({'hello':'DocDB;'}, function(err, result){
// //         //Print the result to the screen

// //         //Close the connection
// //         client.close()
// //       });
// //    });
// });
                    