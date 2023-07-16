import React, {useReducer, useContext} from 'react'

import reducer from './reducer'
//also imported clearalert
import { 
    DISPLAY_ALERT, 
    CLEAR_ALERT, 
    REGISTER_USER_BEGIN, 
    REGISTER_USER_SUCCESS, 
    REGISTER_USER_ERROR 
} from "./actions"
 

//state
const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: null,
    token: null,
    userLocation: '',
}

//create context
const AppContext = React.createContext()

//boilerplate
const AppProvider = ({children}) => {
const [state, dispatch] = useReducer(reducer, initialState)

const displayAlert = () => {
    dispatch({type:DISPLAY_ALERT})
    clearAlert()
}

const clearAlert = () => {
    setTimeout(() => {
        dispatch({type:CLEAR_ALERT }) 
    }, 3000 )

}

const registerUser = async (currentUser) => {
    console.log(currentUser)
}

return <AppContext.Provider value={{...state, displayAlert}} >
{children} 
</AppContext.Provider>
}

//creates custom hook
const useAppContext = () => {
    return useContext(AppContext)
}


export{AppProvider, initialState, useAppContext}