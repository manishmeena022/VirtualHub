const Comment = require('../models/comment');
const Post = require('../models/post');
const User = require('../models/user');
const commentsMailer = require('../mailers/comments_mailer');
const queue = require('../config/kue');
const commentEmailWorker = require('../workers/comment_email_worker');
const Like = require('../models/like');

module.exports.create = async function (req, res) {
    try {
        let post = await Post.findById(req.body.post);

        if (post) {
            let new_comment = await Comment.create({
                content: req.body.content,
                post: req.body.post,
                user: req.user._id,
            });

            post.comments.push(new_comment);//
            post.save();

            let comment = await Comment.findById(new_comment._id)
                .populate('user')
                .populate('post');

            // commentsMailer.newComment(comment);
            let job = queue
                .create('emails', comment)
                .save(function (err) {
                    if (err) {
                        console.log('error in creating a queue', err);
                        return;
                    }
                    console.log('job enqueued', job.id);
                });

            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: comment._id,
                        user_name: comment.user.name,
                        comment_content: comment.content,
                        post_id: comment.post._id,
                    },
                    message: 'Comment Created',
                });
            }

            req.flash('success', 'New Comment Published!');
            return res.redirect('back');
        }
    } catch (error) {
        console.log('Error in creating a comment:', error);
        req.flash('error', 'There was an error in creating a comment!');
        return res.redirect('back');
    }
};

module.exports.destroy = async function (req, res) {
    try {
        let comment = await Comment.findById(req.params.id);

        if (comment.user.toString() === req.user.id) {
            let post_id = comment.post;

            await comment.deleteOne();

            let post = await Post.findByIdAndUpdate(post_id, {
                $pull: { comments: req.params.id },
            });

            // Destroy the associated likes for this comment
            await Like.deleteMany({ likeable: req.params.id, onModel: 'Comment' });

            // Send the comment id which was deleted back to the views
            if (req.xhr) {
                return res.status(200).json({
                    data: {
                        comment_id: req.params.id,
                    },
                    message: 'Comment Deleted',
                });
            }

            req.flash('success', 'Comment Deleted Successfully!');
            return res.redirect('back');
        } else {
            req.flash('error', 'You are Unauthorized to perform this action');
            return res.redirect('back');
        }
    } catch (error) {
        console.log('Error in deleting the comment:', error);
        req.flash('error', 'There was an error in deleting the comment!');
        return res.redirect('back');
    }
};
