const express = require("express");
const {PostModel} = require("../models/postModel")

const postRouter = express.Router();

// postRouter.get("/",async(req,res)=>{
//     const allpost = await PostModel.find();
//     res.send(allpost)
//     console.log(allpost)
// })
postRouter.get("/",async(req,res)=>{
    const userID = req.body.user;
    console.log(userID);
    const device1 = req.query.device1;
    const device2 = req.query.device2;
    if(device1){
        const posts = await PostModel.find({$and:[{"user":userID},{device:device1}]});
        if(posts.length>0){
            res.send({"Posts":posts})
        }else{
            res.send({"msg":"Sorry! there are no posts"})
        }
    }else if(device2 && device1){
        const posts = await PostModel.find({$and:[{"user":userID},{$and:[{device:device2},{device:device1}]}]});
        if(posts.length>0){
            res.send({"Posts":posts})
        }else{
            res.send({"msg":"Sorry! there are no posts"})
        }
    }else{
        try {
            const posts = await PostModel.find({"user":userID});
            if(posts.length>0){
                res.send({"Posts":posts})
            }else{
                res.send({"msg":"Sorry! there are no posts"})
            }
            
        } catch (error) {
            console.log(error)
            res.send({"msg":"Something went wrong"})
        }
    }
})
postRouter.post("/create",async(req,res)=>{
    const payload = req.body;
    const post = new PostModel(payload);
    await post.save();
    console.log({"msg":`Post:- ${post.title} has been created`});
    res.send({"msg":`Post:- ${post.title} has been created`});

})
postRouter.get("/top",async(req,res)=>{
    const userID = req.body.user;
    console.log(userID)
    try {
        const posts = await PostModel.find({"user":userID});
        posts.sort((b,a)=>{
            return a.no_of_comments-b.no_of_comments;
        })
        console.log(posts[0])
        res.send(posts[0])
        
    } catch (error) {
        console.log(error)
        res.send({"msg":"Something went wrong"})
    }
})
postRouter.patch("/update/:id",async(req,res)=>{
    const payload = req.body
    const id = req.params.id;
    const post = await PostModel.find({"_id":id});
    console.log(post)
    const userID = req.body.user;
    console.log(post.user);
    console.log(userID)
    try {
        if(post.user!==userID){
            res.send({"msg":"You are not Authorized to update this post"})
        }else{
            await PostModel.findByIdAndUpdate({"_id":id},payload);
            res.send({"msg":"Post has been updated"})
        }
    } catch (error) {
        console.log(error)
        res.send({"msg":"Something went wrong"})
    }
})
postRouter.delete("/delete/:id",async(req,res)=>{
    const id = req.params.id;
    const post = await PostModel.find({"_id":id});
    console.log(post)
    const userID = req.body.user;
    console.log(post.user);
    console.log(userID)
    try {
        if(post.user!==userID){
            res.send({"msg":"You are not Authorized to delete this post"})
        }else{
            await PostModel.findByIdAndDelete({"_id":id});
            res.send({"msg":"Post has been deleted"})
        }
    } catch (error) {
        console.log(error)
        res.send({"msg":"Something went wrong"})
    }
})
module.exports = {postRouter}
