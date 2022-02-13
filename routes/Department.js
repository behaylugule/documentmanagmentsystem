const Department = require("../models/Department");
const Folder = require("../models/Folder");
const Document = require('../models/Document')
const {getFirebase} = require('../util/fileDelete')
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndAdmin,
} = require("./verifyToken");
const User = require("../models/User");

const router = require("express").Router();

//CREATE

router.post("/", verifyTokenAndAdmin, async (req, res) => {
  const newDepartment = new Department(req.body);

  try {
    const savedDepartment = await newDepartment.save();
    res.status(200).json(savedDepartment);
  } catch (err) {
    res.status(500).json(err);
  }
});

//UPDATE
router.put("/:id", verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedDepartment = await Department.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updatedDepartment);
  } catch (err) {
    res.status(500).json(err);
  }
});


//DELETE
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
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
     const users = await User.find()
     if(users.length){
       const saveUser= users.map(async(user)=>{
          try {
            user.role = user.role.filter(r=>r.depId!==req.params.id)
            await user.save()
            return "user is updated"
          } catch (error) {
            return error
          }
        })
      
        await Promise.all(saveUser).then((results)=>{
          if(!results.length) return;
          console.log(results)
        })
     }
     await Department.findByIdAndDelete(req.params.id);
     res.status(200).json("Folder has been deleted...");
   } catch (err) {
     console.log(err)
     res.status(500).json(err);
   }
});

//GET USER DepartmentS
router.get("/find/:userId", verifyTokenAndAdmin, async (req, res) => {
  try {
    const Departments = await Department.find({ userId: req.params.userId });
    res.status(200).json(Departments);
  } catch (err) {
    res.status(500).json(err);
  }
});

// //GET ALL

router.get("/", verifyTokenAndAdmin, async (req, res) => {
  try {
    const Departments = await Department.find();
    res.status(200).json(Departments);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;
