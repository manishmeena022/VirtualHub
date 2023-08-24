const Post = require('../models/post');
const Comment = require('../models/comment');
const User = require('../models/user');
const Like = require('../models/like');
const posts_mailer = require('../mailers/posts_mailer');

module.exports.create = async function(req, res) {
    try {
        const newPost = await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        const post = await Post.findById(newPost._id).populate('user');
        posts_mailer.new_post(post);

        if (req.xhr) {
            return res.status(200).json({
                data: {
                    post_id: post._id,
                    user_name: post.user.name,
                    post_content: post.content,
                    updatedAt: post.updatedAt
                },
                message: "Post created!"
            });
        }

        req.flash('success', 'Post Published!');
        return res.redirect('back');
    } catch (error) {
        console.error('Error in creating a post:', error);
        req.flash('error', 'There was an error in creating a post!');
        return res.redirect('back');
    }
}

module.exports.destroy = async function(req, res) {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            req.flash('error', 'Post not found');
            return res.redirect('back');
        }

        if (post.user.toString() === req.user.id) {
            // Delete the associated likes for the post and all its comments' likes too
            await Like.deleteMany({ likeable: post, onModel: 'Post' });
            await Like.deleteMany({ _id: { $in: post.comments } });

            await post.deleteOne();
            await Comment.deleteMany({ post: req.params.id });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        post_id: req.params.id
                    },
                    message: "Post deleted"
                });
            }

            req.flash('success', 'Post and associated comments deleted');
            return res.redirect('back');
        } else {
            req.flash('error', 'You cannot delete this post!');
            return res.redirect('back');
        }
    } catch (error) {
        console.error('Error in deleting the post:', error);
        req.flash('error', 'There was an error in deleting the post!');
        return res.redirect('back');
    }
}
