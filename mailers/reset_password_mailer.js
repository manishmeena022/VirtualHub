const nodemailer_config = require('../config/nodemailer');
exports.reset_pass =(token) => {
    nodemailer_config.transporter.sendMail(
        {
            from:'manishkm22897@gmail.com',
            to:token.user.email,
            subject:'VirtualHub | Link to reset password',
            html:`
            <h3>Following is the link to reset your password. please do not share it with anyone.</h3>
            <p>https://localhost:8888/reset_password/reset/?access_token=${token.access_token}</p><br>
            <p>Kindly click on above link to change your password. </p>`
        },
        (error, info) =>{
            if(error){
                console.log('error in sending email!',error);
                return;
            }
            console.log('mail delivered!', info);
            return;
        }
    )
}