import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  userId: {
    type: String,
    unique: [true, "UserId already exists"],
    required: [true, "UserId is required"],
  },
  username: {
    type: String,
    unique: [true, "Username already exists"],
    required: [true, "Username is required"],
  },
});

// models object is provided by mongoose and stores all registered models
// if a model already exists named user, it assigns that existing model to the user variable, preventing the redefining of th emodel and ensuring the existing model is reused.
const User = models.User || model("User", UserSchema);

export default User;
