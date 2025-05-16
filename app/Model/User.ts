import mongoose, { models } from 'mongoose';
const { Schema, model } = mongoose;

const UserSchema = new mongoose.Schema({
  id: String,
  imie: String,
  nazwisko: String,
  login: String,
  haslo: String,
  rola: String
});
let UserModel = models.UserModel

if(UserModel == undefined){
  UserModel=model('UserModel',UserSchema)
}

export default UserModel;
