const Post = require('../../../models/post');
const Comment = require('../../../models/comment');

module.exports.index  = async function(req, res){
    let posts = await Post.find({})
    .sort('-createdAt')
    .populate('user')
    .populate({
        path: 'comments',
        populate :{
            path: 'user'
        }   
    });
    return res.json(200,{
        message: "List of posts",
        api_version: 'v1',
        posts : posts
    })
}

module.exports.destroy = async function(req, res){
    try{
        let post = await Post.findById(req.params.id);
        if(post.user == req.user.id){
            post.deleteOne();

            await Comment.deleteMany({post: req.params.id});
            
            return res.json(200,{
                message: "Post and Associalted Comments deleted Successfully!"
            });
      
        }else{
            return res.json(401, {
                message : "You cannot delete this post!"
            });
        }
    }catch(err){
        console.log('Error',err);
        return res.json(500,{
            messgae: "Internal Server Error"
        })
    }
}