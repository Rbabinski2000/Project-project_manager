import UserModel from "@/app/Model/User";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from 'uuid';

export class UserService {
    private currentUserKey = "currentUser";
    private guest:User={id:"0",imie:"Guest",nazwisko:"Guest",login:"Guest",haslo:"jako",rola:Role.guest}
    private userList:User[]=[
        {id:"1",imie:"Janusz",nazwisko:"Kowalski",login:"Jako",haslo:"jako",rola:Role.admin},
        {id:"2",imie:"Jack",nazwisko:"newton",login:"Jane",haslo:"jane",rola:Role.admin},
        {id:"3",imie:"Kevin",nazwisko:"America",login:"Keam",haslo:"keam",rola:Role.developer},
        {id:"4",imie:"Oman",nazwisko:"Sterlng",login:"Omst",haslo:"omst",rola:Role.devops}
    ]
    // Retrieve all projects from localStorage
    public async getCurrentUser(): Promise<User> {
        const token = localStorage.getItem('token');
        
        if(!token){
            console.log("there is no user logged in")
            return this.guest;
        }else{
        const payload:any=jwt.decode(token)
        const id=payload.id
        
        const res = await fetch(`/api/mongo/users?id=${id}`);
        const user = await res.json();
        //console.log(user)
        return user;
        }

    }
    public async mockUser():Promise<void> {
        const userlist=this.userList;
        //console.log(Role[userlist[3].rola])
        userlist.forEach(async user => {
            try {
                const res = await fetch('/api/mongo/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
                });

                if (!res.ok) {
                const errorData = await res.json();
                console.error("Failed to create user:", errorData.error);
                return;
                }

                const data = await res.json();
                //console.log("User created:", data.user);
            } catch (err) {
                console.error("Network error:", err);
            }
        });
    }
    
    public async getUsers():Promise<User[]>{
        //const users = localStorage.getItem("users");
        //return users ? JSON.parse(users) : [];
        
          try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mongo/users`);
            const users = await res.json();
            
            //const { haslo, ...users } = users;
           
            //console.log("in getUsers",users)
            return users;
          } catch {
            return [];
          }
    }
    public async getById(id: string): Promise<User | undefined> {
        try{
            const res = await fetch(`/api/mongo/users?id=${id}`);
            const user = await res.json();
            return user
        }catch {
            return undefined;
          }
    }
    
    public async getByLogin(login:string):Promise<User | undefined>{
        const userList = await this.getUsers(); // ← dodaj nawiasy ()
        //console.log(userList)
        // Sprawdź, czy to faktycznie jest lista użytkowników
        if (Array.isArray(userList)) {
            return userList.find((user) => user.login === login);
        }

        return undefined;
    }
    public getIdtoAssign(){
        return uuidv4()
    }
    public async createUser(user:User):Promise<User|undefined>{
        
        console.log("in create",user)
        
        try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/mongo/users`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(user),
                });
                
                if (!res.ok) {
                const errorData = await res.json();
                console.error("Failed to create user:", errorData.error);
                return user;
                }

                const data = await res.json();
                //console.log("User created:", data.user);
                return user
            } catch (err) {
                console.error("Network error:", err);
                return undefined
            }
    }
    public logOut(){
        //console.log("wylogowuje się")
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        // const res = await fetch('/api/auth/login', {
        // method: 'DELETE',
        // headers: { 'Content-Type': 'application/json' },
        // });

    
    }
    
}
type userError="There are no registered users"
export interface User {
    id: string;
    imie: string;
    nazwisko: string;
    login:string;
    haslo:string;
    rola:Role
}
export enum Role{
    admin=1,
    devops,
    developer,
    guest
}