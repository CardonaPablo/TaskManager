const express = require('express');
const multer = require('multer');

const router = new express.Router();
const auth = require('../middleware/auth');
const User = require('../models/user');

const sharp = require('sharp');


//Create user
router.post('/users', async (req, res) => {
    
    let user = new User(req.body);
    try {
        await user.save()
        let token = await user.generateAuthToken();
        res.status(201).send({user, token})  
    }
    catch(err) {
        res.status(400).send(err)
    };
})

//Get amy own user
router.get('/users/me', auth , async (req, res) => {
        res.send(req.user);
})

//Update a user
router.patch('/users/me', auth, async (req, res) => {

    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'email', 'password', 'age']
    let isValidOperation = updates.every((value) => allowedUpdates.includes(value))

    if(!isValidOperation)
        return res.status(403).send({ error: 'Cannot update property'})

    try {

        updates.forEach((value) => req.user[value] = req.body[value])
        await req.user.save()
        res.send(req.user)

    } catch (err) {
        res.status(400).send(err);
    }
})

//Delete a user
router.delete('/users/me', auth,  async (req, res) => {

    try {

        await req.user.remove()
        res.send(req.user)

    } catch (err) {
        res.status(500).send(err);
    }
})

router.post('/users/login', async (req, res) => {
    try {
        let user = await User.findByCredentials(req.body.email, req.body.password);
        let token = await user.generateAuthToken()
        res.send({user, token});
    
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logoutAll', auth, async (req, res) => {
    req.user.tokens = []
    await req.user.save()
    res.send()
})

router.post('/users/logout', auth, async (req, res) => {
    try {
        console.log('Req', req.user.tokens)
        console.log('TOken', req.token)
        req.user.tokens = req.user.tokens.filter((token)=> token.token !== req.token)
        console.log(req.user.tokens)
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

//Upload avatar
const upload = multer({
    limits: {
        fileSize: 1000000
    },
    fileFilter(req, file, cb) {
        if(!file.originalname.match(/\.(jpg|jpeg|png)$/))
            return cb(new Error('Please upload an image'))
        cb(undefined, true)
    }
})

//Second function is to catch middleware errors from multer
router.post('/users/me/avatar', auth, upload.single('avatar'), async (req, res) => {

    //Edit image to png and resize

    let buffer = await sharp(req.file.buffer)
    .png()
    .resize({width: 250, height: 250})
    .toBuffer()

    req.user.avatar = buffer

    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message})
}) 

//Delete avatar
router.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined;
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message})
}) 

//Fetch avatar
router.get('/users/:id/avatar', async (req, res) => {
    try {
        let user = await User.findById(req.params.id);

        if(!user || !user.avatar)
            throw new Error()
        
        res.set('Content-Type', 'image/png')
        res.send(user.avatar)

    } catch (e) {
        res.status(404).send()
    }
})
module.exports = router;