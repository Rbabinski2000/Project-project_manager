import mongoose, { Document, Model, Schema, models } from 'mongoose';

// 1) Plain-TS interface
export interface Project {
  id: string;
  nazwa: string;
  opis: string;
}

// 2) Mongoose Document interface
export interface ProjectDocument extends Document {
  id: string;
  nazwa: string;
  opis: string;
}

// 3) Schema definition
const ProjectSchema = new Schema<ProjectDocument>({
  id:   { type: String, required: true, unique: true },
  nazwa:{ type: String, required: true },
  opis: { type: String, required: true }
}, {
  timestamps: false
});

// 4) Model export
export type ProjectModelType = Model<ProjectDocument>;
let ProjectModel = models.ProjectModel as ProjectModelType;
if (!ProjectModel) {
  ProjectModel = mongoose.model<ProjectDocument, ProjectModelType>('ProjectModel', ProjectSchema);
}
export default ProjectModel;
