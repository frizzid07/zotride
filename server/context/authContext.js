import AsyncStorage from "@react-native-async-storage/async-storage";
import { useState, createContext } from "react";

import { NGROK_TUNNEL } from "@env";

// export const AuthContext = createContext({
//     token: '',
//     user: '',
//     isLoggedIn: false,
//     isLoading: false,
//     authenticate: () => {},
//     setIsLoggedIn: () => {},
//     logout: () => {}
// });

export const AuthContext = createContext();

export default AuthProvider = ({children}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState();
    const [user, setUser] = useState();
    
    async function authenticate(authToken) {
        setIsLoading(true);
        setIsLoggedIn(true);
        setToken(authToken);
        try {
            let checkUser = await fetch(NGROK_TUNNEL+"/auth", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(authToken)
            });
            const userData = await checkUser.json();
            if(userData.userData !== undefined) {
                setUser(userData.userData);
                await AsyncStorage.setItem('user', JSON.stringify(userData.userData));
            }
        } catch(error) {
            console.log(`Login Error: ${error}`)
        } finally {
            setIsLoading(false);
            return isLoggedIn;
        }
    }

    async function logout() {
        setIsLoading(true);
        try {
            await AsyncStorage.removeItem('user');
            setIsLoggedIn(false);
            setToken(null);
        } catch(error) {
            console.log(`Logout Error: ${error}`)
        } finally {
            setIsLoading(false);
        }
    }

    const value = {
        token: token,
        user: user,
        isLoggedIn: isLoggedIn,
        isLoading: isLoading,
        authenticate: authenticate,
        setIsLoggedIn: setIsLoggedIn,
        logout: logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}


// export const AuthProvider = ({children}) => {
//     const [isLoading, setIsLoading] = useState(false);
//     const [user, setUser] = useState(null);

//     const login = async(data) => {
//         setIsLoading(true);
//         await fetch(NGROK_TUNNEL+"/login", {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(data)
//         })
//             .then(res => res.json()).then(
//                 res => {
//                     console.log(res);
//                     if (res.error) {
//                         alert(res.error);
//                     }
//                     else {
//                         alert('Logged in successfully');
//                         setUser(res.token);
//                         console.log('Logged in successfully with user '+res.token);
//                         AsyncStorage.setItem('user', res.token);
//                     }
//                 }
//             ).catch((error) => {
//               // Handle any errors that occur
//               console.error('Error:', error);
//           }).finally (()=> {
//             setIsLoading(false);
//           });
//     }

    // const logout = async() => {
    //     try {
    //         setIsLoading(true);
    //         await AsyncStorage.removeItem('user');
    //         setUser(null);
    //         setIsLoading(false);
    //     }
    //     catch (error) {
    //         console.log(`Login Error ${error}`)
    //     }
    // }

    // const isLoggedIn = async() => {
    //     try {
    //         setIsLoading(true);
    //         let user = await AsyncStorage.getItem('user');
    //         setUser(user);
    //         setIsLoading(false);
    //     }
    //     catch (error) {
    //         console.log(`Login Error ${error}`)
    //     }
    // }

    // useEffect(() => {
    //     isLoggedIn();
    // }, []);