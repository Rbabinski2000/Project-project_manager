import { NextRequest, NextResponse } from "next/server";
import { OAuth2Client } from "google-auth-library";
import { Role, User, UserService } from "@/src/services/userServices";
import jwt from "jsonwebtoken";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID!);

const JWT_SECRET = process.env.JWT_SECRET!;
const REFRESH_SECRET = process.env.REFRESH_SECRET!;

export async function POST(req: NextRequest) {
  const { credential } = await req.json();
  const userService=new UserService();
  
  try {
    
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    
    if (!payload) return NextResponse.json({ error: "Invalid token" }, { status: 400 });

    const {name,given_name,family_name}=payload;
    //console.log(name)
    let user;
    const userToCreate:User={id:"0",imie:given_name!,nazwisko:family_name? family_name:"guest",login:name!,haslo:"0",rola:Role.guest}
    //console.log("undef check-",await userService.getByLogin(userToCreate.login))
    if(await userService.getByLogin(userToCreate.login)==undefined){
      userToCreate.id=userService.getIdtoAssign();
      user=await userService.createUser(userToCreate)
    }else{
      user=await userService.getByLogin(userToCreate.login);
    }
    //console.log("in goog",user)
    if(user){
      const tokenPayload = { id: user.id, login: user.login};
      const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: "15m" });
      const refreshToken = jwt.sign(tokenPayload, REFRESH_SECRET, { expiresIn: "7d" });
      //console.log("in google-",jwt.decode(token))
     return NextResponse.json({ token, refreshToken });
    }
    
    return NextResponse.json({ error: "User undefined" }, { status: 401 });
  } catch (error) {
    return NextResponse.json({ error: "Auth failed" }, { status: 401 });
  }
}


