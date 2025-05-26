console.log(import.meta.env.VITE_SERVER_URL);

export const HOST=import.meta.env.VITE_SERVER_URL
export const AUTH_ROUTES="api/auth"
export const SIGNUP_ROUTE=`${AUTH_ROUTES}/signUp`
export const SIGNIN_ROUTE=`${AUTH_ROUTES}/logIn`
export const GET_USER_INFO=`${AUTH_ROUTES}/userInfo`
export const UPDATE_PROFILE_ROUTE=`${AUTH_ROUTES}/update-profile`
export const ADD_PROFILE_IMAGE_ROUTE=`${AUTH_ROUTES}/add-profile-image`;
export const REMOVE_PROFILE_IMAGE_ROUTE=`${AUTH_ROUTES}/remove-profile-image`;
export const SIGNOUT_ROUTE=`${AUTH_ROUTES}/logOut`


export const CONTACTS_ROUTE="api/contacts";
export const SEARCH_CONTACTS=`${CONTACTS_ROUTE}/search`

