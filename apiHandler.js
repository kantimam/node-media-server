const express = require('express');
const multer = require('multer');
const path = require('path')
const fs=require('fs');

const router = express.Router();


const storage = multer.diskStorage({
    destination: (req, file, cb)=>cb(null, 'files/'),
    filename: (req, file, cb) => cb(null, `${Date.now()}_${path.basename(file.originalname)}`)
})
const upload = multer({
    storage: storage
})


router.post("/upload", upload.single('file'), (req, res, next) => {
    res.send("succesfully uploaded your file");
    next();
})

router.get('/stream', (req, res, next)=>{
    return fs.createReadStream('files/1580589101510_coon.png').pipe(res);
})


router.get('/audio', function(req, res) {
    const filePath = 'files/tool.webm'
    const stat = fs.statSync(filePath)
    const fileSize = stat.size
    const range = req.headers.range
    const mime=path.extname(filePath)? `audio/${mime.substr(1)}` : 'audio/webm';
    if (range) {
      const parts = range.replace(/bytes=/, "").split("-")
      const start = parseInt(parts[0], 10)
      const end = parts[1] 
        ? parseInt(parts[1], 10)
        : fileSize-1
      const chunksize = (end-start)+1
      const file = fs.createReadStream(filePath, {start, end})
      const head = {
        'Content-Range': `bytes ${start}-${end}/${fileSize}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunksize,
        'Content-Type': mime? `audio/${mime.substr(1)}` : 'audio/webm',
      }
      res.writeHead(206, head);
      file.pipe(res);
    } else {
      const head = {
        'Content-Length': fileSize,
        'Content-Type': 'video/mp4',
      }
      res.writeHead(200, head)
      fs.createReadStream(filePath).pipe(res)
    }
  });



module.exports = router