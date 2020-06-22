module.exports= async function (req,res,next) {
    if(req.valid===undefined)
        next();
    else if(!req.valid)
        return res.status(400).send("only images and videos are allowed !");
}