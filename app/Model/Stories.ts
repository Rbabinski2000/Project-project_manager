import mongoose, { Document, Model, Schema, models } from 'mongoose';
import { Project, ProjectDocument } from '@/app/Model/Projects';
import { Priority, State } from './Types/StoriesTypes';



export interface StoryDocument extends Document {
  id: string;
  nazwa: string;
  opis: string;
  priorytet: Priority;
  projekt: mongoose.Types.ObjectId | ProjectDocument;
  projektId: string;
  data_utworzenia: string;
  stan: State;
  wlasciciel: string;
}

const StorySchema = new Schema<StoryDocument>({
  id:              { type: String, required: true, unique: true },
  nazwa:           { type: String, required: true },
  opis:            { type: String, required: true },
  priorytet:       { type: Number,  required: true },
  projekt:         { type: Schema.Types.ObjectId, ref: 'ProjectModel', required: true },
  projektId:       { type: String, required: true, index: true },
  data_utworzenia: { type: String, required: true },
  stan:            { type: Number,  required: true },
  wlasciciel:      { type: String}
}, {
  timestamps: false
});

export type StoryModelType = Model<StoryDocument>;
let StoryModel = models.StoryModel as StoryModelType;
if (!StoryModel) {
  StoryModel = mongoose.model<StoryDocument, StoryModelType>('StoryModel', StorySchema);
}

export default StoryModel;
