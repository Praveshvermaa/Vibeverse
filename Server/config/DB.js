const { default: mongoose } = require("mongoose");


const connection = () => {
    try {
        mongoose.connect(process.env.DATABASE_URL)
            .then(() => console.log("MongoDB connected"))
    }

    catch(err) {
         console.log("error :", err) 
        }
}
module.exports = connection;