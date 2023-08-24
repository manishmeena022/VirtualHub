const mongoose = require('mongoose');

const like_schema= new mongoose.Schema({
    user: {
        type: mongoose.Schema.ObjectId,
        ref:'User'
    },
    //this defines the object id of the linked object
    likeable : {
        type: mongoose.Schema.Types.ObjectId,
        require: true,
        refPath: 'onModel'
    },
    //this field is used for defining the type of the liked object since this is a dynamic reference
    onModel: {
        type: String,
        required : true,
        enum : ['Post','Comment']
    }
},{
    timestamps: true
});

const Like = mongoose.model('Like', like_schema);
module.exports = Like;