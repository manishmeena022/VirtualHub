const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comment");
const User = require('../models/user');

module.exports.toggle_like = async (req, res) =>{
    try{
        let likeable;
        let deleted = false;

        if(req.query.type == 'Post'){
            likeable = await Post.findById(req.query.id).populate('likes');
        }else{
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        //check if a like already exists
        let existing_like = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        //if a like already exists then delete it
        if(existing_like){
            /* remove the like from the likeable and then delete it from the like model */
            /* removing from the likeable i.e posts or comments */
            likeable.likes.pull(existing_like._id);
            likeable.save();
            
            existing_like.deleteOne();//remove() is not working
            deleted = true;
        
        }else{
            //else make a new like
            let new_like = await Like.create({
                user: req.user._id,
                likeable: req.query.id,
                onModel: req.query.type
            });

            likeable.likes.push(new_like);
            likeable.save();
        }
        return res.status(200).json({
            message: "Request successful!",
            data: {
                deleted: deleted
            }
        })
    }catch(error){
        if(error){
            console.log(error);
            return res.status(500).json({ message: 'Internal Server Error'});
        }
    }   
}