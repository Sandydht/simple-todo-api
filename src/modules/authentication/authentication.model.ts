export interface AuthenticationErrorModel {
  status: string;
  message: string;
}

export interface AuthenticationResponse {
  status: string;
  access_token: string;
}

export interface AuthenticationProfileResponse {
  status: string;
  data: AuthenticationUserData;
}

export interface AuthenticationUserData {
  image_url: string;
  username: string;
}
