export interface GroupModel {
  kind?: string;
  id?: string;
  etag?: string;
  email?: string;
  name?: string;
  directMembersCount?: string;
  description?: string;
  adminCreated?: boolean;
  aliases?: string[];
  nonEditableAliases?: string[];
  members?: GroupMember[];
}

export interface GroupMember {
  id?: string;
  email?: string;
  role?: string;
  type?: string;
  status?: string;
  fullName?: string;
}
