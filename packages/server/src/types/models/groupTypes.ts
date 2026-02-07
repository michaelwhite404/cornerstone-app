import { admin_directory_v1 } from "googleapis";

export interface GroupModel extends admin_directory_v1.Schema$Group {
  members?: GroupMember[];
}

export interface GroupMember {
  id?: admin_directory_v1.Schema$Member["id"];
  email?: admin_directory_v1.Schema$Member["email"];
  role?: admin_directory_v1.Schema$Member["role"];
  type?: admin_directory_v1.Schema$Member["type"];
  status?: admin_directory_v1.Schema$Member["status"];
  fullName?: string;
}
