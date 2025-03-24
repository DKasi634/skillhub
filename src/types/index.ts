import { IProfile } from "@/api/types";

export type nextRouteLocation = {
    fromRoute:Location
  }

// Example Redux action for profile update
export interface UpdateProfilePayload {
  updates: Partial<IProfile>;
  userId: string;
}

export type SelectedImage = {
  file:File,
  url:string;
}
