const nodemailer_config = require('../config/nodemailer');

module.exports.new_post = (post) => {
    let htmlString= nodemailer_config.renderTemplate({post:post},'/posts/new_post.ejs')
    nodemailer_config.transporter.sendMail(
        {
            from: 'manishkm22897@gmail.com',
            to:post.user.email,
            subject: 'VirtualHub Post published',
            html:htmlString,
        },
        (error,info)=>{
            if(error){
                console.log('Error in sending mail', error);
                return;
            }
            console.log('Mail delivered!', info);
            return;
        }
    )
}