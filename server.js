const express = require("express");
const cors = require("cors");
const db = require('./models');
const app = express();
const fs = require('fs');
const multer = require('multer')
const path = require('path')
const port = 3000;
const Contacts = db.contact;

// parse requests of content-type - application/json
app.use(express.json());
// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const corsConfig = {
  credentials: true,
  origin: true,
};

const now = Date.now()

var storage = multer.diskStorage({
  destination: function (req,file,cb){
    cb(null,"public/images");
  },
  filename:function(req,file,cb){
    cb(null,now  + '-' + file.originalname)
  }
})

var upload = multer({storage:storage}).single('file')
//First 'images' -url , second filepath
app.use('/images', express.static(__dirname + '/public/images'));

app.use(cors(corsConfig));


app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

app.get("/contacts", async (req, res) =>  {
  const all_contact = await Contacts.findAll();
 res.json(all_contact);
});

app.get("/contact/:id", async (req, res) =>  {
  const contact = await Contacts.findOne({ where: { contact_id: req.params['id']} })

  if(contact === null){
    return res.status(404).send()
  }
  else{
    return res.status(200).send(contact)
  }
});

app.post("/file", async (req,res)=>{
  upload(req,res,(err) =>{
    if(err){
      console.log(err);
    }
  })
  return res.status(200).json('Profil dodany prawidlowo!')
});

app.post("/add-contact", async (req,res) => {
  const new_contact = await Contacts.create({ 
    contact_name: req.body.contact_name,
    contact_surname: req.body.contact_surname,
    contact_bday: req.body.contact_bday,
    contact_photo:  'images/' + now + '-'+ req.body.contact_photo
  });



  return res.status(200).send();
});

app.post("/delete-contact", async (req,res) => {
  const contact_id = req.body.contact.contact_id
  const contact_photo = 'public/'+req.body.contact.contact_photo;


  //Destroy in DB
  const new_contact = await Contacts.destroy({
    where: {
      	contact_id: contact_id
    }
  });

      //Destroy in localfile
      fs.unlink(contact_photo,function(err){
        if(err) return res.status(200).json(err);
        return res.status(200).json('Profil został usunięty!')
      }); 


});

app.post("/update-contact-photo", async(req,res)=>{
  const categories = await Contacts.update({ 
    contact_name: req.body.contact_name,
    contact_surname: req.body.contact_surname,
    contact_bday: req.body.contact_bday,
    contact_photo: 'images/' + now + '-'+ req.body.contact_photo
   }, {
    where: {
      contact_id: req.body.contact_id
    }
  });
  return res.status(200).json('Profil został zaktualizowany!')
});

app.post("/update-contact", async(req,res)=>{
  const categories = await Contacts.update({ 
    contact_name: req.body.contact_name,
    contact_surname: req.body.contact_surname,
    contact_bday: req.body.contact_bday,
   }, {
    where: {
      contact_id: req.body.contact_id
    }
  });
  return res.status(200).json('Profil został zaktualizowany!')
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

//Production
db.sequelize.sync();