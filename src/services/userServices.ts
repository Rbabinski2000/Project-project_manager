export interface User {
    id: string;
    imie: string;
    nazwisko: string;
}

export class UserService {
    private currentUserKey = "currentUser";

    // Retrieve all projects from localStorage
    public getCurrentUser(): User {
        let userString = localStorage.getItem(this.currentUserKey);
        if(!userString){
            //create mock user
            const mockUser:User={
                id:"1",
                imie:"Janusz",
                nazwisko:"Kowalski"
            };
            localStorage.setItem(this.currentUserKey, JSON.stringify(mockUser))
            return mockUser;
        }
        return JSON.parse(userString)

    }

    
}