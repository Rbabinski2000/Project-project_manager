import { User } from "lucide-react";

export interface User {
    id: string;
    imie: string;
    nazwisko: string;
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
        {id:"2",imie:"Jack",nazwisko:"newton",rola:Role.admin},
        {id:"3",imie:"Kevin",nazwisko:"America",rola:Role.developer},
        {id:"4",imie:"Oman",nazwisko:"Sterlng",rola:Role.devops}
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

    
}