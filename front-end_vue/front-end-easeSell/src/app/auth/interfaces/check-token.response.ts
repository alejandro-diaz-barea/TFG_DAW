import { User } from "./user.interfaces";


export interface CheckTokenResponse {
  user:User;
  token:string;
}
