import express from 'express';

const router=express.Router();

//sign up endpoint
router.get("/signup",(req,res)=>{
    res.json({
        data: "you hit the signup endpoint",
    });
});

// login endpoint
router.get("/login",(req,res)=>{
    res.json({
        data:"you hit the login endpoint",
    });
});
export default router;