// require('express');
// require('mongodb');

exports.login = function(app, client) {
    app.post('/api/user/login', async (req, res, next) =>
    {
        // incoming: username, password
        // outgoing: id, objectId, fullname error

        var error = '';

        const {username, password} = req.body;

        const db = client.db();
        const results = await db.collection('users').find({username:username,password:password}).toArray();

        res.status(200).json(results[0]);
    });
}

exports.register = function(app, client) {
    app.put('/api/user/register', async (req, res, next) =>
    {
        // incoming: biography, DOB, email, phoneNumber, username, password,
        // outgoing: success/fail message
        var message = '';
        var myDate = Date();

        const {biography, dob, email, phoneNumber, username, password} = req.body;

        const db = client.db();
        await db.collection('users').insertOne({
            biography:biography,
            DOB:dob,
            email:email,
            phoneNumber:phoneNumber,
            username:username,
            password:password,
            profileImageUrl:'http://...',
            dateJoined:myDate,
            followerCount:0,
            followerIDs:[],
            followingCount:0,
            followingIDs:[],
            postCount:0,
            posts:[],
            likedPosts:[],
            bookedMarkedPosts:[],
            unreadNotifications:0,
            notifications:[],
            DMIDS:[],
            pushNotificationsOn:true
        });
        var ret = {message:'successfully inserted a new user'};
        res.status(200).json(ret);
    });
}
