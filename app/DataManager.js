function DataManager() {

    // this.mongoose = require('mongoose');
    // this.mongoose.connect('mongodb://127.0.0.1/app');
    // 
    // console.log("---> Opening Mongodb ("+ this.mongoose.version +") connection");
    // 
    // this.schema = this.mongoose.Schema;
    // this.objectId = this.schema.ObjectId;
    // 
    // 
    // var Flash = new this.schema({
    //     user: String,
    //     date: Date
    // });
    // 
    // var Save = new this.schema({
    //     user: String,
    //     date: Date
    // });
    // 
    // var Visit = new this.schema({
    //     user: String,
    //     date: Date
    // });
    // 
    // var Message = new this.schema({
    //     emitter: String,
    //     receiver: String,
    //     title: String,
    //     message: String,
    //     date: Date
    // });
    // 
    // var Thread = new this.schema({
    //     users: Array,
    //     messages: [Message]
    // });
    // 
    // this.mongoose.model('Thread', Thread);
    // 
    // var User = new this.schema({
    //     gender: String,
    //     email: String,
    //     country: String,
    //     pic: String,
    //     login: String,
    //     password: String,
    //     saved: [Save],
    //     savedBy: [Save],
    //     visited: [Visit],
    //     visitedBy: [Visit],
    //     flashed: [Flash],
    //     flashedBy: [Flash],
    //     threads: Array
    // });
    // 
    // this.mongoose.model('User', User);

    var mysql = require('mysql');

    console.log("---> Opening MySQL ("+ mysql.version +") connection");

    this.client = mysql.createClient({user: 'root', password: 'juX2p0mX'});
    this.client.query('USE meet');

}

// DataManager.prototype.getModel = function(name) {
//     return this.mongoose.model(name);
// };

// DataManager.prototype.createModel = function(model, fields) {
//     var model = this.mongoose.model(model, new this.schema(fields));
//     return model;
// };
// 
// DataManager.prototype.generateModels = function() {
//     for (var i = 0, l = this.models.length; i < l; i++) {
//         this.createModel(this.models[i].name, this.models[i].fields);
//     }
// };

module.exports = new DataManager();
