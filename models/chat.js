import { Schema, model, models } from "mongoose";

const ChatSchema = new Schema({
    messages: {
        type: Array,
        required: true
    },
    agentName: {
        type: String,
        required: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
});

const Chat = models.Chat || model("Chat", ChatSchema);

export default Chat;