import {environment} from "../../../environments/environment";

const BASE_URL = environment.production? '' : 'http://localhost:3000';


export const USER_LOGIN_URL = BASE_URL + '/api/users/login';

export const USER_REGISTER_URL = BASE_URL + '/api/users/register';

export const USER_LOGOUT_URL = BASE_URL + '/api/users/logout';

export const REFRESH_TOKEN_URL = BASE_URL + '/api/users/refresh-token';

export const UPDATE_USER_PASSWORD = BASE_URL + '/api/users/update-password';

export const UPDATE_USER_AVATAR = BASE_URL + '/api/users/avatar';



export const POST_URL = BASE_URL + '/api/posts';

export const POST_CREATION_URL = BASE_URL + '/api/posts/create';

export const TIMELINE_URL = BASE_URL + '/api/timeline';
export const TIMELINE_CREATION_URL = BASE_URL + '/api/timeline/create';
