import mongoose from 'mongoose'
 
 
 
 const postSchema = new mongoose.Schema({
     caption: {
         type: String,
     },
     media: {
         type: Object,
         required: [ true, 'Media is required' ],
     },
     author: {
         type: mongoose.Schema.Types.ObjectId,
         ref: 'user',
         required: [ true, 'Author is required' ],
     },
 },
     {
         timestamps: true,
     }
 )
 
 
 postSchema.statics.getAuthorPosts = async function (authorId) {
 
     if (!authorId) {
         throw new Error("Author is required")
     }
 
     const posts = await this.find({
         author: authorId
     })
 
     return posts;
 
 }
 
 postSchema.methods.updateCaption = async function (caption) {
 
     this.caption = caption;
     await this.save();
 
     return this;
 }
 
 postSchema.statics.getRecentPosts = async function (limit) {
 
     if (!limit) {
         throw new Error("Limit is required")
     }
 
     const posts = await this.find().sort({ createdAt: -1 }).limit(limit);
 
     return posts;
 
 }
 
 const postModel = mongoose.model("post", postSchema);
 
 
 export default postModel;