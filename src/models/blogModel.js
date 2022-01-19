const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({

    title:{
        type:String,
        required:true
    },

    body:{
        type:String,
        required:true
    },

    authorId:{
        type:mongoose.Types.ObjectId,
        required:true,
        refs:'AuthorProjectOne'
    },

    tags:[{
        type:String,
        trim:true
    }],

    category:{
        type:String,
        required:true,
        trim: true
    },

    subcategory:[{
        type:String,
        trim:true
    }],

    isPublished:{
        type:Boolean,
        default:false
    },

    publishedAt:{
        type:Date,
        default:null
    },

    isDeleted:{
        type:Boolean,
        default:false
    },

    deletedAt:{
        type:Date,
        default:null
    }

} , { timestamps : true});

module.exports = mongoose.model('BlogProjectOne' , blogSchema);