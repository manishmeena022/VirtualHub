const User = require('../models/user');
const fs = require('fs');
const Friendship = require('../models/friendship');
const path = require('path');

module.exports.profile = async (req, res) =>{
    try{
        const user = await User.findById(req.params.id);

        let are_friends = false;

        const friendship = await Friendship.findOne({
            $or: [
                { from_user : req.user._id , to_user: req.params.id },
                { from_user : req.params.id , to_user: req.user.id},
            ],
        });
        if(friendship){
            are_friends = true;
        }

        const options = {
            user_name : "manish meena",
            title: "VirtualHub",
            profile_user : user, /* it is the user whose profile i am currently browsing */
            are_friends : are_friends
        }
        return res.render('user_profile', options);
    }catch(error){
        console.log('Enter:',error);
        return res.status(500).send('Interval Server Error');
    }
};


module.exports.update = async function(req, res){

    if(req.user.id == req.params.id){
        try{

            let user = await User.findById(req.params.id)
            User.uploadedAvatar(req, res, function(err){
                if(err){
                    console.log('*****Multer Error: ', err);
                }
                user.name = req.body.name;
                user.email = req.body.email;

                if(req.file){
                    if(user.avatar){
                        fs.unlinkSync(path.join(__dirname, '..', user.avatar));
                    }

                    //this is saving the path of uploaded file into the avatar field in the user
                    user.avatar = User.avatarPath + '/' + req.file.filename;
                }
                user.save();
                return res.redirect('back');
            });
            
        }catch(error){
            req.flash('error',error);
            return res.redirect('back');
        }
    }else{
        req.flash('error','Unauthorized !');
        return res.status(401).send('Unauthorized');
    }
}

// render the Sign up page 
module.exports.signUp = function(req, res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_signup',{
        titlte: "VirtualHub | Sign up"
    });
}

//render the signIn page
module.exports.signIn = function(req,res){
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
    return res.render('user_signin' ,{
        title: "VirtualHub | Sign In"
    });
}


//Get the sign up data
module.exports.create = function(req, res){
    if(req.body.password != req.body.confirm_password){
        req.flash('error','Passwords do no match');
        return res.redirect('back');
    }

    const findUser = () => {
        return new Promise((resolve, reject) => {
            User.findOne({ email: req.body.email })
                .then(user => {
                    req.flash('success','You have signed up, login to continue');
                    resolve(user);

                })
                .catch(err => {
                    req.flash('error,err');
                    reject(err);
                });
        });
    };

    const createUser = () => {
        return new Promise((resolve, reject) => {
            User.create(req.body)
                .then(user => {
                    resolve(user);
                })
                .catch(err => {
                    console.log('Error in creating user while signing up ');
                    reject(err);
                });
        });
    };

    findUser()
        .then(user => {
            if (!user) {
                return createUser();
            } else {
                return Promise.reject('User already exists');
            }
        })
        .then(() => {
            res.redirect('/users/sign-in');
        })
        .catch(err => {
            console.error(err);
            res.redirect('back');
        });
};



//Sign in and create a session for the user
module.exports.createSession = function(req, res){
    req.flash('success','logged in Successfully');
    return res.redirect('/');
}



module.exports.destroySession = function(req, res, next){
    req.logout( function(err){
        if(err){
            return next(err);
        }
        res.redirect('/');
    });
    req.flash('success','logged out Successfully');
}