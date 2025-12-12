import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ collection: 'Employee-Data' })
export class User {
  // 1. Simple String Fields
  @Prop()
  avatar!: string;

  @Prop({ required: true })
  name!: string;

  @Prop()
  designation!: string;

  @Prop()
  department!: string;

  // 2. Handling Arrays (String[])
  // We use [String] to tell Mongoose this is a list of strings
  @Prop(String)
  skills!: string;

  @Prop()
  code!: string; // Mapping to 'code' or 'EmployeeID'

  // 3. Handling Mixed Types (String OR Number)
  // We use MongooseSchema.Types.Mixed for fields that can change type
  @Prop({ type: MongooseSchema.Types.Mixed })
  experience!: string | number;

  @Prop()
  Reporting_to!: string;

  @Prop()
  Team_Manager!: string;

  @Prop()
  Project!: string;

  @Prop({ unique: true })
  email!: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
