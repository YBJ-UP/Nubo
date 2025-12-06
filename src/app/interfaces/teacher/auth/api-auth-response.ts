import { TeacherAuthResponse } from "./teacher-auth-response";

export interface ApiAuthResponse {
    token: string;
    teacher: TeacherAuthResponse;
}
