import { User } from "lucide-react";

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

export class UserService {
    private currentUserKey = "currentUser";
    private userList:User[]=[
        {id:"2",imie:"Jack",nazwisko:"newton",login:"Jane",haslo:"jane",rola:Role.admin},
        {id:"3",imie:"Kevin",nazwisko:"America",login:"Keam",haslo:"keam",rola:Role.developer},
        {id:"4",imie:"Oman",nazwisko:"Sterlng",login:"Omst",haslo:"omst",rola:Role.devops}
    ]
    // Retrieve all projects from localStorage
    public getCurrentUser(): User {

        this.mockUser(this.userList);
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
    private mockUser(projects: User[]): void {
            localStorage.setItem("users", JSON.stringify(projects));
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