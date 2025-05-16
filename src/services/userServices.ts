import UserModel from "@/app/Model/User";
import User from "@/app/Model/User";
import jwt from "jsonwebtoken";


export class UserService {
    private currentUserKey = "currentUser";
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
    public getUsers():User[]{
        const users = localStorage.getItem("users");
        return users ? JSON.parse(users) : [];
    }
    public getById(id: string): User | undefined {
        return this.getUsers().find((user) => user.id === id);
    }
    public getByIdList(id: string): User | undefined {
        return this.userList.find((user) => user.id === id);
    }
    public getByLogin(login:string):User|undefined{
        // return this.getUsers().find((user) => user.imie === login);
        
        return this.userList.find((user) => user.login === login);
    }
    public async logOut(){
        console.log("wylogowuje się")
        const res = await fetch('/api/auth/login', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    });

    
    }
    
}
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
    developer
}