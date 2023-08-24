const fs = require('fs');
const rfs = require('rotating-file-stream');
const path = require('path');

const logDirectory = path.join(__dirname, '../production_logs');
fs.existsSync(logDirectory)|| fs.mkdirSync(logDirectory);//cleaver way to write code!

const accessLogStream = rfs.createStream('access.log',{
    interval: '1d',
    path: logDirectory,
});

const development = {
    name: 'development',
    asset_path : process.env.VIRTUALHUB_ASSET_PATH,
    session_cookie_key : process.env.VIRTUALHUB_SESSION_COOKIE_KEY,
    db:  'VirtualHub_development',
    smtp: {
        service : 'gmail',
        host: 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth : {
            user : process.env.VIRTUALHUB_SMTP_AUTH_USER,
            pass : process.env.VIRTUALHUB_SMTP_AUTH_PASS
        }
    },
    google_client_id : process.env.VIRTUALHUB_GOOGLE_CLIENT_ID,
    google_client_secret : process.env.VIRTUALHUB_GOOGLE_CLIENT_SECRET,
    google_call_back_URL : process.env.VIRTUALHUB_GOOGLE_CALLBACK_URL,
    jwt_secret : process.env.VIRTUALHUB_JWT_SECRET_OR_KEY,
    morgan: {
        mode:'dev',
        options: {stream: accessLogStream}
    }
    
}
const production = {
    name: 'production',
    asset_path: process.env.VIRTUALHUB_ASSET_PATH,
    session_cookie_key: process.env.VIRTUALHUB_SESSION_COOKIE_KEY,
    db:  process.env.VIRTUALHUB_DB,
    smtp: {
        service : 'gmail',
        host: 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth : {
            user : process.env.VIRTUALHUB_SMTP_AUTH_USER,
            pass : process.env.VIRTUALHUB_SMTP_AUTH_PASS
        }
    },
    google_client_id : process.env.VIRTUALHUB_GOOGLE_CLIENT_ID,
    google_client_secret : process.env.VIRTUALHUB_GOOGLE_CLIENT_SECRET,
    google_call_back_URL : process.env.VIRTUALHUB_GOOGLE_CALLBACK_URL,
    jwt_secret :  process.env.VIRTUALHUB_JWT_SECRET_OR_KEY,
    morgan: {
        mode:'combined',
        options: {stream: accessLogStream}
    }
}


module.exports = eval(process.env.NODE_ENV) == undefined ? development : eval(process.env.NODE_ENV)
