import { Document } from "mongoose";

export interface TextbookSetModel {
  /** Id of the textbook set */
  _id: any;
  /** Title of the textbook set*/
  title: string;
  /** Class the textbook set is used for */
  class: string;
  /** Array of grades the textbook set is used for */
  grade: number;
  /** Number of active textbook set in this set  */
  count: number;
  /** Textbook set slug */
  slug: string;
}

export interface TextbookSetDocument extends TextbookSetModel, Document {
  _id: any;
}
