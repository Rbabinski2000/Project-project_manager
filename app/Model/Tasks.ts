import mongoose, { Document, Model, Schema, models } from 'mongoose';
import {StoryDocument } from '@/app/Model/Stories';
import { User, UserDocument } from '@/app/Model/User';
import { Story } from './Types/StoriesTypes';

// 1) Enums inside the file
export enum Priority {
  niski  = 0,
  sredni = 1,
  wysoki = 2
}
export enum State {
  todo  = 1,
  doing = 2,
  done  = 3
}

// 2) Plain-TS interface
export interface Task {
  id: string;
  nazwa: string;
  opis: string;
  priorytet: Priority;
  historia: Story;
  historiaId:string;
  szacowany_czas: number;
  status: State;
  data_dodania: string;
  data_startu?: string;
  data_ukonczenia?: string;
  przypisany_uzytkownik?: string;
}

// 3) Mongoose Document interface
export interface TaskDocument extends Document {
  id: string;
  nazwa: string;
  opis: string;
  priorytet: Priority;
  historia: mongoose.Types.ObjectId | StoryDocument;
  historiaId:string;
  szacowany_czas: number;
  status: State;
  data_dodania: string;
  data_startu?: string;
  data_ukonczenia?: string;
  przypisany_uzytkownik?: string;
}

// 4) Schema definition
const TaskSchema = new Schema<TaskDocument>({
  id:                   { type: String, required: true, unique: true },
  nazwa:                { type: String, required: true },
  opis:                 { type: String, required: true },
  priorytet:            { type: Number,  required: true },
  historia:             { type: Schema.Types.ObjectId, ref: 'StoryModel', required: true },
  historiaId:           {type:String,   required:true},
  szacowany_czas:       { type: Number, required: true },
  status:               { type: Number,  required: true },
  data_dodania:         { type: String, required: true },
  data_startu:          { type: String },
  data_ukonczenia:      { type: String },
  przypisany_uzytkownik:{ type: String}
}, {
  timestamps: false
});

// 5) Model export
export type TaskModelType = Model<TaskDocument>;
let TaskModel = models.TaskModel as TaskModelType;
if (!TaskModel) {
  TaskModel = mongoose.model<TaskDocument, TaskModelType>('TaskModel', TaskSchema);
}
export default TaskModel;
