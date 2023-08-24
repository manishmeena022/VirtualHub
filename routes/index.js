const express = require('express');

const router = express.Router();
const homeController = require('../controllers/home_controller');

console.log('Router loaded');

router.get('/', homeController.home);
router.use('/users', require('./users'));
router.use('/posts', require('./posts'));
router.use('/comments', require('./comments'));
router.use('/reset_password', require('./reset_password_enter_email'));
router.use('/likes', require('./likes'));

router.use('/api' , require('./api'));

module.exports = router;