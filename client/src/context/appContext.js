import React, { useReducer, useContext } from 'react'

import reducer from './reducer'

import axios from 'axios'
//also imported clearalert
import {
    DISPLAY_ALERT,
    CLEAR_ALERT,
    REGISTER_USER_BEGIN,
    REGISTER_USER_SUCCESS,
    REGISTER_USER_ERROR,
    LOGIN_USER_BEGIN,
    LOGIN_USER_SUCCESS,
    LOGIN_USER_ERROR,
    TOGGLE_SIDEBAR,
    LOGOUT_USER, 
    UPDATE_USER_BEGIN,
    UPDATE_USER_SUCCESS,
    UPDATE_USER_ERROR
 
} from "./actions"

const token = localStorage.getItem('token')
const user = localStorage.getItem('user')
const userLocation = localStorage.getItem('location')
//state
const initialState = {
    isLoading: false,
    showAlert: false,
    alertText: '',
    alertType: '',
    user: user ? JSON.parse(user) : null,
    token: token,
    userLocation: userLocation || '',
    jobLocation: userLocation || '',
    showSidebar: false,
}

//create context
const AppContext = React.createContext()

//boilerplate
const AppProvider = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState)

    //axios
    const authFetch = axios.create({
        baseURL: '/api/v1',

    })

    //request 
    //now we are able to access tours with no bearer token by using authFetch
    authFetch.interceptors.request.use(
        (config) => {
            config.headers['Authorization'] = `Bearer ${state.token}`
            return config
        },
        (error) => {
            return Promise.reject(error)
        }
    )
 
    //response
    authFetch.interceptors.response.use(
        (response) => {
            return response
        },
        (error) => {
            console.log(error.response)
            if(error.response.status === 401) {
                //invoke if there is no proper credentials/Bearer token
                logoutUser()
   
            }
            return Promise.reject(error)
        }
    )


    const displayAlert = () => {
        dispatch({ type: DISPLAY_ALERT })
        clearAlert()
    }

    const clearAlert = () => {
        setTimeout(() => {
            dispatch({ type: CLEAR_ALERT })
        }, 3000)

    }

    //user,token,location comes from the response
    const addUserToLocalStorage = ({ user, token, location }) => {
        localStorage.setItem('user', JSON.stringify(user))
        localStorage.setItem('token', token)
        localStorage.setItem('location', location)
    }

    const removeUserFromLocalStorage = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        localStorage.removeItem('location')
    }

    const registerUser = async (currentUser) => {
        dispatch({ type: REGISTER_USER_BEGIN })
        try {
            const response = await axios.post('/api/v1/auth/register', currentUser);
            // console.log(response) -- for JOHN object
            const { user, token, location } = response.data
            dispatch({
                type: REGISTER_USER_SUCCESS,
                payload: { user, token, location },
            })
            //LOCAL STORAGE FUNCTION
            addUserToLocalStorage({ user, token, location })
        } catch (error) {
            // console.log(error.response) for JOHN object
            dispatch({
                type: REGISTER_USER_ERROR,
                payload: { msg: error.response.data.msg },
            })

        }
        clearAlert()
    }

    const loginUser = async (currentUser) => {
        dispatch({ type: LOGIN_USER_BEGIN })
        try {
            const { data } = await axios.post('/api/v1/auth/login', currentUser);

            const { user, token, location } = data
            dispatch({
                type: LOGIN_USER_SUCCESS,
                payload: { user, token, location },
            })
            //LOCAL STORAGE FUNCTION
            addUserToLocalStorage({ user, token, location })
        } catch (error) {

            dispatch({
                type: LOGIN_USER_ERROR,
                payload: { msg: error.response.data.msg },
            })

        }
        clearAlert()
    }

    const toggleSidebar = () => {
        dispatch({ type: TOGGLE_SIDEBAR })
    }

    const logoutUser = () => {
        dispatch({ type: LOGOUT_USER })
        removeUserFromLocalStorage()
    }

    const updateUser = async (currentUser) => {
        dispatch({ type: UPDATE_USER_BEGIN })
        try {
            const { data } = await authFetch.patch('/auth/updateUser', currentUser)

            //logs the data that was updated, similar to the format of currentUser
            // console.log(data)
            const { user, token, location } = data
            //send data to payload
            dispatch({type: UPDATE_USER_SUCCESS, payload: {user, token, location}})
            addUserToLocalStorage({ user, token, location})

        } catch (error) {
            // console.log(error.response)
            //once a user is logged out, there is no need to show auth error on the login screen since they are already kicked out
            if(error.response.status !== 401) {
                dispatch({
                    type:UPDATE_USER_ERROR,
                    payload: {msg: error.response.data.msg}
                })
            }
        }
        clearAlert()
    }

    return <AppContext.Provider
        value={{ ...state, displayAlert, registerUser, loginUser, toggleSidebar, logoutUser, updateUser }} >
        {children}
    </AppContext.Provider>
}

//creates custom hook
const useAppContext = () => {
    return useContext(AppContext)
}


export { AppProvider, initialState, useAppContext }