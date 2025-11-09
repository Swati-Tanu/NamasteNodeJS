const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    firstName: {
        type: String
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String
    },
    password:{
        type: String
    },
    age:{
        type:String
    },
    gender:{
        type:String
    }
})

const UserModel = mongoose.model("User", userSchema)

module.exports = UserModel;