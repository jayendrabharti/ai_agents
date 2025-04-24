import { Schema, model, models } from "mongoose";

const ChatsSchema = new Schema({
    chatHistory: {
        type: String,
        required: true,
        default: ""
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
},
{
  timestamps: true
}
);

const Chats = models.Chats || model("Chats", ChatsSchema);

export default Chats;