const mongoose = require('mongoose')

const dbConnect = async () => {
    try {
        await mongoose.connect("mongodb+srv://kjgilder:2htuyRZ09zyS1m0R@pwwusers.8ssyv.mongodb.net/?retryWrites=true&w=majority&appName=PWWUsers", {
        })
        console.log('MongoDB Connected')
    } catch (error) {
        console.error(error)
    }
  }
  
  dbConnect()