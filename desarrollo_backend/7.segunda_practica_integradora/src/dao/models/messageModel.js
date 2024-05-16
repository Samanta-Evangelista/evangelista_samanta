import mongoose from "mongoose";

const messageColecction = "messages";

const messageSchema = new mongoose.Schema({
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    }
});

const messageModel = mongoose.model(messageColecction, messageSchema); 

export default messageModel;