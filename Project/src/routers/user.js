const express = require ('express')
const router =new express.Router()
const User= require('../models/user')
const multer  = require('multer')
const sharp = require('sharp')
const path=require('path')

const auth =require('../middleware/auth')


router.get('/',(req,res)=>{
    res.render('index' , {title : 'Home Page'})
})

router.post('/users/signup', async (req,res)=>{

    const user=new User(req.body)
    //console.log(req.body)
    try{

        await user.save()
     
        const token= await user.generateAuthToken()
        res.status(201).send({user,token})

    } catch(e){ 
        
        res.status(400).send(e)
    }
   =
})


router.get('/users/me', auth , async (req,res)=>{

    
    console.log('ayya ha')
    res.send(req.user)
  
})


router.patch('/users/me', auth , async (req,res)=>{

    const updates=Object.keys(req.body)
    const allowedUpdates=['name','email','password','age']
    const isValid= updates.every((update)=> allowedUpdates.includes(update))

    if(!isValid)
    {
        return res.status(400).send({error: 'Invalid Update'})
    } 
    try{

    
        updates.forEach(function (update){ console.log(update)})
        updates.forEach((update)=> req.user[update]=req.body[update])
        await req.user.save()

        res.send(req.user) 
        
    } catch(e){
        res.status(400).send(e)

    }
})

router.post('/users/login',async(req,res) => {


    try{
      
        const user =await User.findByCredentials(req.body.email,req.body.password) 
     
        const token = await user.generateAuthToken();
        res.send({user,token})
    } catch(e){  

        res.status(400).send()

    }
})





router.post('/users/logout',auth, async(req,res) => {
    try{
        req.user.tokens = req.user.tokens.filter((token)=>{
            return token.token !==req.token
        })

        await req.user.save()
        res.send(req.user)

    }catch(e){
        res.status(500).send()


    }
})


router.post('/users/logoutAll' , auth , async(req , res) => {

    try{
        req.user.tokens=[]
        await req.user.save()
        res.send()
    } catch(e){

        res.status(500).send()

    }
})


router.delete('/users/me', auth , async (req,res)=>{
    
    try{
        const user = await User.findByIdAndDelete(req.user._id)

         // Delete associated tasks
        await Task.deleteMany({ owner: req.user._id });
       
        if(!user)
        return res.status(404).send()
        res.send(user);


        
    } catch(e){
        res.status(500).send()
    }
}) 


module.exports= router   
