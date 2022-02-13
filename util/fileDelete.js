const { getStorage, ref, deleteObject } = require("firebase/storage");
const app = require('../util/firebase')
const Document = require('../models/Document')
exports.getFirebase = async(doc) => {
    const storage = getStorage(app);
    const firebaseDelete =  doc.map(j=>{
        const desertRef = ref(storage, j.documentUrl);
        deleteObject(desertRef).then(async() => {
          try {
            await Document.findByIdAndDelete(j._id)
            return "deleted from firebase"
          } catch (error){
            console.log(err)
            return error
          }
        }).catch((error) => {
          console.log(error)
          return error
        });
      })

      await Promise.all(firebaseDelete).then((results)=>{
        console.log(results)
      })
  }
  