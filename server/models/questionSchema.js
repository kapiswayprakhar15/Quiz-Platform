import mongoose from "mongoose";
const {Schema} = mongoose;

const questionModel = new Schema({
    questions:{type:Array, default:[]},
    answers:{type:Array,default:[]},
});

export default mongoose.model('Question',questionModel);