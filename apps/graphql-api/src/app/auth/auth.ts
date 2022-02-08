/* eslint-disable @typescript-eslint/no-this-alias */
import * as jwt from 'jsonwebtoken'
import {AuthenticationError} from 'apollo-server-express'
import { environment } from '../../environments/environment';


export const authorizeAndVerify = async (req) =>{
  //////////
  const authorizationHeader = req.headers.authorization || '';
  if(!authorizationHeader){
    authError();
  }
  /////////
  const token = authorizationHeader.replace('Bearer ', '');
  if(!token || token === ''){
   authError();
  }
  /////////
  let decodeJWT;
  try {
    decodeJWT = jwt.verify(token, environment.HashSecret);
    if(!decodeJWT){
      authError();
    }
    req.isAuth = true;
    req.token = token,
    req._id = decodeJWT._id;
    req.email = decodeJWT.email;
    return req;
    ////
  } catch (error) {
  throw new AuthenticationError(error);
  }

}
function authError(){
  const req = this;
  req.isAuth = false;
  throw new AuthenticationError('Auth Error')
}
