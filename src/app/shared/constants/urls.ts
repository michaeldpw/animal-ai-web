import {environment} from "../../../environments/environment";

const BASE_URL = environment.apiUrl;


export const USER_LOGIN_URL = BASE_URL + '/users/login';

export const USER_REGISTER_URL = BASE_URL + '/users/register';

export const USER_LOGOUT_URL = BASE_URL + '/users/logout';

export const REFRESH_TOKEN_URL = BASE_URL + '/users/refresh-token';

export const UPDATE_USER_PASSWORD = BASE_URL + '/users/update-password';

export const UPDATE_USER_AVATAR = BASE_URL + '/users/avatar';



export const POST_URL = BASE_URL + '/posts';

export const POST_CREATION_URL = BASE_URL + '/posts/create';

export const TIMELINE_URL = BASE_URL + '/timeline';
export const TIMELINE_CREATION_URL = BASE_URL + '/timeline/create';

export const COMMENT_CREATION_URL = BASE_URL + '/comments/create';
export const COMMENT_SEARCH_URL = BASE_URL + '/comments';

export const PLACE_URL = BASE_URL + '/place';


