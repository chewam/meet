function DataManager() {

    this.mongoose = require('mongoose');
    this.mongoose.connect('mongodb://chewam.com/app');

    console.log("---> Opening Mongodb ("+ this.mongoose.version +") connection");

    this.schema = this.mongoose.Schema;
    this.objectId = this.schema.ObjectId;

    this.models = [{
        name: 'User',
        fields: [{
            // id: ObjectId,
            // firstName: String,
            // lastName: String,
            gender: String,
            email: String,
            country: String,
            pic: String,
            login: String,
            password: String
        }]
    }];

    this.generateModels();
}

DataManager.prototype.getModel = function(name) {
    return this.mongoose.model(name);
};

DataManager.prototype.createModel = function(model, fields) {
    var model = this.mongoose.model(model, new this.schema(fields));
    return model;
};

DataManager.prototype.generateModels = function() {
    for (var i = 0, l = this.models.length; i < l; i++) {
        this.createModel(this.models[i].name, this.models[i].fields);
    }
};

module.exports = new DataManager();
