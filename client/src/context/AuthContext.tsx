import { jwtDecode } from 'jwt-decode';
import { createContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface User{
    id: string;
    email: string;
    role:string;
}

interface AuthContextType{
    user: User | null ;
    setUser: (user: User | null ) => void;
    isLoading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider =({children}:{children: ReactNode})=>{
    const [user,setUser]=useState<User | null>(null)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(()=>{
        const token = localStorage.getItem('token');
        if(token){
            const decodedUser: User = jwtDecode<User>(token);
            setUser(decodedUser);
        }
        setIsLoading(false);
    },[]);

    return(
        <AuthContext.Provider value = {{user,setUser,isLoading}}>
            {children}
        </AuthContext.Provider>
    );
};