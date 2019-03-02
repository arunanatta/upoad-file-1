var express =   require('express');
var multer  =   require('multer');
var app     =   express();
var path = require('path');
var bodyParser = require('body-parser');
var Upload = require('./uploadModel');


var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.originalname);
  }
});

const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

var upload = multer({ 
  storage : storage,
  fileFilter: filter,
  limits : {fileSize:5*1024*1024}
}).single('File');

function filter(req,file,cb){
  var ext = file.originalname.split('.')[1];
  console.log(ext)
  if(ext !== 'png' && ext !== 'pdf' && ext !== 'txt' && ext !== 'xlsx' && ext !== 'docx') {
    return cb(new Error('error'));
  }
  return cb(null,file);
}


app.get('/',function(req,res){
  res.sendFile(__dirname + "/index.html");
});

app.post('/uploadfile', function(req,res){
  console.log(req.file)
  upload(req,res,function(err) {
    console.log(req.file)
    if(err) {
      return res.status(500).json({
        message:"Check your file must be a image and it should be less than 5 mb"
      });
    }
   // console.log(res)
    
    let img = req.file;
    console.log(img)
    let model = new Upload({
      name: img.originalname,
      size: img.size,
      mimetype: img.mimetype,
    });
    console.log(model)
  //  console.log(JSON.stringify(file))
    Upload.base64_encode("./uploads/"+img.originalname)
      .then((base64) => {
        model['base64'] = base64;
        model.save((err)=> {
          if(err) throw err;
      });
      res.status(201).json({
        message:"file successfully uploades"
      })
    });
  
  });
});

app.listen(port, () => {
  console.log('Server started on port'+port);
});

module.exports = app;