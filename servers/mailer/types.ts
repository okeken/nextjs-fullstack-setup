export interface UserObj {
  name: string;
  email: string;
  link: string;
}

export interface ImailgunAuth {
  auth: {
    api_key: string | undefined;
    domain: string | undefined;
  };
}
