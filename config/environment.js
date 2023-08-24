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
    asset_path : './assets',
    session_cookie_key : "Z8E30BJPwD9DJgLl8rJD3WLbR8Mn1izn",
    db:  'VirtualHub_development',
    smtp: {
        service : 'gmail',
        host: 'smtp.gmail.com',
        port : 587,
        secure : false,
        auth : {
            user : 'manishkm22897@gmail.com',
            pass : 'dxfounyedyvxftpy'
        }
    },
    google_client_id : "66476516893-nu0u3rtire4i5hgmrjenjfo5mg7r6lvn.apps.googleusercontent.com",
    google_client_secret : "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",
    google_call_back_URL : "http://localhost:8888/users/auth/google/callback",
    jwt_secret : "9zzE4iV1FRgMiKaxqjVOogZtriPE4WaZ",
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
