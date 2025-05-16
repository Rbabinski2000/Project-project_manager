import UserModel from "@/app/Model/User";
import User from "@/app/Model/User";



export class UserService {
    private currentUserKey = "currentUser";
    private userList:User[]=[
        {id:"1",imie:"Janusz",nazwisko:"Kowalski",login:"Jako",haslo:"jako",rola:Role.admin},
        {id:"2",imie:"Jack",nazwisko:"newton",login:"Jane",haslo:"jane",rola:Role.admin},
        {id:"3",imie:"Kevin",nazwisko:"America",login:"Keam",haslo:"keam",rola:Role.developer},
        {id:"4",imie:"Oman",nazwisko:"Sterlng",login:"Omst",haslo:"omst",rola:Role.devops}
    ]
    // Retrieve all projects from localStorage
    public getCurrentUser(): User {
        const userString = localStorage.getItem(this.currentUserKey);
        if(!userString){
            //create mock user
            const mockUser:User={
                id:"1",
                imie:"Janusz",
                nazwisko:"Kowalski",
                login:"Jako",
                haslo:"jako",
                rola:Role.admin
            };
            localStorage.setItem(this.currentUserKey, JSON.stringify(mockUser))
            return mockUser;
        }
        return JSON.parse(userString)

    }
    public async mockUser():Promise<void> {
        const projects=this.userList;
        projects.forEach(async project => {
            try {
                const res = await fetch('/api/mongo/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(project),
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