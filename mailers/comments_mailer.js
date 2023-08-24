const nodemailer_config = require('../config/nodemailer');

//This is another way or exporting a method
exports.create_new_comment = (comment) => {
    let htmlString = nodemailer_config.renderTemplate({ comment : comment }, '/comments/new_comment.ejs');
    nodemailer_config.transporter.sendMail({
        from : 'manishkm22897@gmail.com',
        to : comment.user.email,
        subject : "New Comment Published!",
        html : htmlString
    }, (err, info) => {
        if(error){
            console.log('Error in sending mail', error);
            return;
        }
        console.log('mail delivered!',info);
        return;
    });
}