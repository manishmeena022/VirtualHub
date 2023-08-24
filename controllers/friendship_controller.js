const User = require('../models/user');
const Friendship = require('../models/friendship');

module.exports.toggle_friendship = async (req, res) => {
    try {
        const from_id = req.user._id;
        const to_id = req.params.id;
        const existingFriendship = await Friendship.findOne({
            $or: [
                { from_user: from_id, to_user: to_id },
                { from_user: to_id, to_user: from_id }
            ]
        });

        if (existingFriendship) {
            // Remove friendship from users database
            await User.findByIdAndUpdate(from_id, { $pull: { friendships: existingFriendship._id } });
            await User.findByIdAndUpdate(to_id, { $pull: { friendships: existingFriendship._id } });

            // Remove friendship from friendships database
            await Friendship.deleteOne({
                $or: [
                    { from_user: from_id, to_user: to_id },
                    { from_user: to_id, to_user: from_id }
                ]
            });
        } else {
            // Create and add new friendship
            const newFriendship = await Friendship.create({ from_user: from_id, to_user: to_id });
            await newFriendship.save();
            await User.findByIdAndUpdate(from_id, { $push: { friendships: newFriendship._id } });
            await User.findByIdAndUpdate(to_id, { $push: { friendships: newFriendship._id } });
        }
        return res.redirect('back');
    } catch (error) {
        console.log('An error occurred:', error);
        return res.status(500).send('An error occurred');
    }
};
