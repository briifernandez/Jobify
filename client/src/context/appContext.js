import React, {useReducer, useContext} from 'react'

import reducer from './reducer'
//also imported clearalert
import { DISPLAY_ALERT, CLEAR_ALERT } from './actions'
 

//state
const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
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

return <AppContext.Provider value={{...state, displayAlert}} >
{children} 
</AppContext.Provider>
}

//creates custom hook
const useAppContext = () => {
    return useContext(AppContext)
}


export{AppProvider, initialState, useAppContext}