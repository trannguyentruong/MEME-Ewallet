const multer = require('multer')
const fs = require('fs')
const path = require('path')

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        var dir = req.vars.root+'/uploads/users/'+req.body.email+'/'
        if(!fs.existsSync(dir)){
            fs.mkdirSync(dir)
        }
        cb(null,dir)
    },
  
    filename: function(req, file, cb) {
        cb(null, file.fieldname + "-" + path.extname(file.originalname));
    }
});
  
var upload = multer({ storage: storage })
var uploadMultiFile = upload.fields([{name: "frontPhoto",maxCount:1}, {name: "backPhoto",maxCount:1}])

module.exports = {uploadMultiFile}