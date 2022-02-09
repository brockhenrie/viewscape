/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-this-alias */
import * as jwt from 'jsonwebtoken'
import {AuthenticationError} from 'apollo-server-express'
import { environment } from '@env/graphql-api';


export const authorizeAndVerify = async (req:any) =>{
  //////////
  const authorizationHeader = req.headers.authorization || '';
  if(!authorizationHeader){
    req.isAuth = false;
    authError(0);
  }
  /////////
  const token = authorizationHeader.replace('Bearer ', '');
  if(!token || token === ''){
    req.isAuth = false;
   authError(1);
  }
  /////////
  let decodeJWT;
  try {
    decodeJWT = await jwt.verify(token, environment.HashSecret);
    if(!decodeJWT){
      req.isAuth = false;
      authError(2);
    }
    req.isAuth = true;
    req.token = token,
    req._id = decodeJWT._id;
    req.email = decodeJWT.email;
    return req;
    ////
  } catch (error) {
    req.isAuth = false;
    authError(3, error)
  }

}

const authCodeMessages = {
  0: "No Auth in header!",
  1: "Token in request header missing!",
  2: "Token not verified",
  3: "Auth Error:"
}


function authError(code:number, error?:any){
  // const req = this;
  // req.isAuth = false;
  throw new AuthenticationError( authCodeMessages[code] + error)
}
