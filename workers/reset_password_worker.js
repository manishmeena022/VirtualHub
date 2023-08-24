const queue = require('../config/kue');
const reset_password_mailer = require('../mailers/reset_password_mailer');

queue.process('send_reset_pass_mailer', function(job, done){
    reset_password_mailer.reset_pass(job.data);
    done();
})