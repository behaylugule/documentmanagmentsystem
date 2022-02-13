const Document = require('../models/Document')
const Folder = require("../models/Folder");
const {getFirebase} = require('../util/fileDelete')
const User =require('../models/User')
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const { async } = require('@firebase/util');

const router = require("express").Router();

//CREATE
router.post("/", verifyToken, async (req, res) => {
  const newFolder = new Folder(req.body);

  try {
    console.log(newFolder)
    const savedFolder = await newFolder.save();
    res.status(200).json(savedFolder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const updatedFolder = await Folder.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedFolder);
  } catch (err) {
    res.status(500).json(err);
  }
});

//DELETE
router.delete("/:id", verifyToken, async (req, res) => {
  try {
   let folderToBe = [] 
   let doc =  await Document.find({parent:req.params.id})
     if(doc.length){
       await getFirebase(doc)
    }
   let folder = await Folder.find({parent:req.params.id})
    folderToBe = [...folder]
    let folderIndex = 0  
    while(true){
      let x = [...folderToBe]
      let y = x.splice(folderIndex);
      folderIndex = folderToBe.length
     const promises =   y?.map(async(i)=>{
          let data = await Folder.find({parent:i._id.toString()})
          folderToBe = folderToBe.concat(data)
          return folderToBe
     }) 
      await Promise.all(promises).then((results)=> {
        if(!results.length) return ;
        folderToBe = [...results[0]]
       })
       if(folderToBe.length===folderIndex) break;
    }
    
    const documentDeleted = folderToBe?.map(async(i)=>{
      try {
        await Folder.findByIdAndDelete(i._id);
         doc = await Document.find({parent:i._id})
         if(doc.length){
           await getFirebase(doc)
         }
        return "Document has been deleted"
      } catch (error) {
        return error
      } 
    })
    await Promise.all(documentDeleted).then((results)=>{
      if(!results.length) return;
    
    })
    await Folder.findByIdAndDelete(req.params.id);
    res.status(200).json("Folder has been deleted...");
  } catch (err) {
    console.log(err)
    res.status(500).json(err);
  }
});

//GET USER Folder
router.get("/find/:userId", verifyToken, async (req, res) => {
  try {
    const folder = await Folder.findOne({ userId: req.params.userId });
    res.status(200).json(folder);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL
router.get("/", verifyToken, async (req, res) => {
  try {
    const folders = await Folder.find();
    res.status(200).json(folders);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/stats/:id",verifyToken,async(req,res)=>{
  try {
    let folderToBe = []
    let documentToBe = []
    const user = await User.findById(req.params.id)
      for(let i=0;i<user?.role?.length;i++){
        let folder = await Folder.find({parent:user.role[i].depId})
        let document = await Document.find({parent:user.role[i].depId})
     folderToBe = folderToBe.concat(folder)
     documentToBe = documentToBe.concat(document)
     let folderIndex = 0  
     while(true){
       let x = [...folderToBe]
       let y = x.splice(folderIndex);
       folderIndex = folderToBe.length
      const promises =   y?.map(async(i)=>{
           let data = await Folder.find({parent:i._id.toString()})
           folderToBe = folderToBe.concat(data)
           return folderToBe
      }) 

       await Promise.all(promises).then((results)=> {
         if(!results.length) return ;
         folderToBe = [...results[0]]
        })
        if(folderToBe.length===folderIndex) break;
     }
     
   }
   
 
   const documentDeleted = folderToBe?.map(async(i)=>{
    try {
       doc = await Document.find({parent:i._id})
       documentToBe.concat(doc)
    } catch (error) {
      return error
    } 
  })
  await Promise.all(documentDeleted).then((results)=>{
   // if(!results.length) return;  
  })
 
   const data = {folder:folderToBe.length,document:documentToBe.length}
   res.status(200).json(data)
  } catch (error) {
    console.log(error)
    res.status(500).json(error)
  }
})

module.exports = router;
