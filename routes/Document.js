const Document = require("../models/Document");
const Folder = require('../models/Folder');
const sgMail = require('@sendgrid/mail')
const fs = require('fs')
const {getStorage,ref,getStream,getMetadata,getBytes} = require('firebase/storage')
const app = require('../util/firebase')
const {
  verifyToken,
} = require("./verifyToken");

const router = require("express").Router();

//CREATE

router.post("/", verifyToken, async (req, res) => {
  const newDocument = new Document(req.body);
  try {
    const savedDocument = await newDocument.save();
    res.status(200).json(savedDocument);
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedDocument = await Document.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedDocument);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
    await Document.findByIdAndDelete(req.params.id);
    res.status(200).json("Document has been deleted...");
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET Document
router.get("/find/:id",verifyToken, async (req, res) => {
  try {
    const Document = await Document.findById(req.params.id);
    res.status(200).json(Document);
  } catch (err) {
    res.status(500).json(err);
  }
});

//GET ALL DocumentS
router.get("/:parent",verifyToken ,async (req, res) => {
  const parent = req.params.parent; 
  try {
    const  Documents = await Document.find({parent:parent}).sort({ createdAt: -1 });
    const folders = await Folder.find({parent:parent}).sort({createdAt:-1})
    
    res.status(200).json([...Documents,...folders]);
  } catch (err) {
    res.status(500).json(err);
  }
});

//sendEmail

router.post('/email',verifyToken,async(req,res)=>{
     sgMail.setApiKey('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');;
      try {
        const storage = getStorage(app);
        const httpsReference = await ref(storage,req.body.documentUrl); 
        const data = await getBytes(httpsReference,100000000)
        var uint8View = new Uint8Array(data); 
        const base64String = new Buffer.from(uint8View).toString('base64');
        //const sendData = uint8View.toString("base64")
        
             console.log(req.body)
        await sgMail.send({
          to          :req.body.receiverEmail,
          from        :req.body.senderEmail,
          subject     : 'Document',
          attachments : [{filename: req.body.documentName, 
                         content: base64String,
                         type: 'application/pdf',
                         disposition: "attachment",
                         contentId: 'myId'
       }],
     html        : 'Here is the document'
  })  
     res.status(200).json({message:"message sent successfully!!!"})
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})
module.exports = router;
