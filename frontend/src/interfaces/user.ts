export interface SignUpInput {
    username: string;
    email: string;
    password: string;
    captcha_token?: string;
}
  
export interface SignInInput {
    username: string;
    password: string;
}

export interface UserPatchRequest {
    username?: string;
    password?: string;
}