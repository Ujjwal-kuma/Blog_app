const mongoose = require("mongoose")
const express = require("express")
const ejs = require("ejs")
const path = require("path")
const blogSchema= require("./blogSchema")
const fileUpload = require("express-fileupload")
const app = express()
const currentPath = path.join(__dirname, "views")
app.set("view engine", "ejs")
let blog= mongoose.model("blog", blogSchema)

app.use(express.static(currentPath))
app.use(express.urlencoded({extended: false}))
app.use(express.json())
app.use(fileUpload({limits: {fileSize: 1000000000}, abortOnLimit: true,}))

app.get('/', (req, resp) => {
    resp.sendFile(`${currentPath}/index.html`)
})

let details = [];
const now = new Date();

const year = now.getFullYear();
const month = ("0" + (now.getMonth() + 1)).slice(-2);
const day = ("0" + now.getDate()).slice(-2);

// YYYY-MM-DD

app.get('/addblog', (req, resp) => {
    resp.sendFile(`${currentPath}/blogForm.html`)
})

app.post('/addblog', async (req, resp) => {
    details = [];
    const { image } = req.files;
    if (!image) return resp.sendStatus(400);
    image.mv(__dirname + '/views/uploads/' + image.name);
    let id = req.body.id;
    let disc = req.body.disc;
    let title = req.body.title;
    let imagename = `./uploads/${image.name}`
    let data = await blog({ image: imagename, id:id, disc: disc, date: `${day}-${month}-${year}`, title: title })
    let result = await data.save()
    let datas = await blog.find();
    console.log();
    for (let i = 0; i < datas.length; i++) {
        details.push({
            imagepath: datas[i].image,
            id: datas[i].id,
            disc: datas[i].disc,
            date: datas[i].date,
            title: datas[i].title,
        })
    }
    resp.send("Blog Updated")
    details = [];
})

app.get("/blogs", async (req, resp)=>{
    let datas = await blog.find();
    for(let i = 0; i< datas.length; i++){
        details.push({
            imagepath: datas[i].image,
            id:datas[i].id,
            disc: datas[i].disc,
            date: datas[i].date,
            title: datas[i].title,

            
        })
    }
    resp.render("blogs", {data: details })
    details=[];
})

app.get("/update/:id", async (req, resp) =>{
    let blogData = await blog.findOne({_id: req.params.id });
    let data = {
        title: blogData.title,
        disc: blogData.disc,
        id:blogData._id,
        imagepath: blogData.image,
    }
    resp.render('update', {data: data})
})

app.post('/update/:id', async (req, resp)=>{
    let blogData = await blog.findOne({_id: req.params.id });
    let imgName ='';
    if(req.files){
       let {image} = req.files;
       if (!image) return resp.sendStatus(400);
       imgName = `./uploads/${image.name}`;
       image.mv(__dirname + '/views/uploads/' + image.name);
       
    }
    else{
        imgName = blogData.image;
    }
    let {title, disc}= req.body;
    console.log(imgName)
    let update = await blog.findOneAndUpdate({_id: req.params.id}, {title:title, disc:disc,image:imgName})
    resp.redirect("/blogs")
})

let port = 7000;
app.listen(port, () => {
    console.log(`server is running at port ${port}`)
});