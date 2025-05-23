import mongoose, { Document, Model, Schema, models } from 'mongoose';

// 1) Enums inside the file
export enum Role {
  admin     = 1,
  devops    = 2,
  developer = 3,
  guest     = 4
}

// 2) Plain-TS interface
export interface User {
  id: string;
  imie: string;
  nazwisko: string;
  login: string;
  haslo: string;
  rola: Role;
}

// 3) Mongoose Document interface
export interface UserDocument extends Document {
  id: string;
  imie: string;
  nazwisko: string;
  login: string;
  haslo: string;
  rola: Role;
}

// 4) Schema definition
const UserSchema = new Schema<UserDocument>({
  id:       { type: String, required: true, unique: true },
  imie:     { type: String, required: true },
  nazwisko: { type: String, required: true },
  login:    { type: String, required: true, unique: true },
  haslo:    { type: String, required: true },
  rola:     { type: Number, enum: Object.values(Role), required: true }
}, {
  timestamps: false
});

// 5) Model export
export type UserModelType = Model<UserDocument>;
let UserModel = models.UserModel as UserModelType;
if (!UserModel) {
  UserModel = mongoose.model<UserDocument, UserModelType>('UserModel', UserSchema);
}
export default UserModel;
