const express=require('express');
const cors=require('cors');
const app=express();
const apiHandler=require('./apiHandler')

const PORT=process.env.PORT || 5000;

app.use("/api", apiHandler)


app.use('/admin', (req, res, next)=>{
    console.log("before static");
    const r=Math.random();
    if(r>0.4){
        next(new Error("you are not allowed to see this! :("))
    }
    return next();
})
app.use('/admin/static', express.static('files'));




app.listen(PORT, ()=>console.log(`running on port ${PORT}`))

