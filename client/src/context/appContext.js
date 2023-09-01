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
    UPDATE_USER_ERROR,
    HANDLE_CHANGE, 
    CLEAR_VALUES, 
    CREATE_JOB_BEGIN,
    CREATE_JOB_SUCCESS,
    CREATE_JOB_ERROR,
    GET_JOBS_BEGIN,
    GET_JOBS_SUCCESS,
    SET_EDIT_JOB,
    DELETE_JOB_BEGIN,
    EDIT_JOB_BEGIN,
    EDIT_JOB_SUCCESS,
    EDIT_JOB_ERROR,
    SHOW_STATS_BEGIN,
    SHOW_STATS_SUCCESS,
 
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
    showSidebar: false,

    //related to jobs
    isEditing: false,
    editJobId: '',
    position: '',
    company: '',
    jobLocation: userLocation || '',
    jobTypeOptions: ['full-time', 'part-time', 'remote', 'internship'],
    jobType: 'full-time',
    statusOptions: ['interview', 'declined', 'pending'],
    status: 'pending',

    //get all jobs
    jobs: [],
    totalJobs: 0,
    numOfPages: 1,
    page: 1,

    stats: {},
    monthlyApplications: [],
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

    const handleChange = ({ name, value}) => {
        dispatch({ type: HANDLE_CHANGE, payload: {name, value }})
    }

    const clearValues = () => {
        dispatch({type: CLEAR_VALUES})
    }

    const createJob = async () => {
        dispatch({type: CREATE_JOB_BEGIN})
        try {
            const { position, company, jobLocation, jobType, status } = state
            await authFetch.post('/jobs', {
                position, 
                company, 
                jobLocation, 
                jobType, 
                status
            })
            dispatch({ type: CREATE_JOB_SUCCESS })
            dispatch({ type: CLEAR_VALUES })
        } catch (error) {
            if( error.response.status === 401) return
            dispatch({
                type: CREATE_JOB_ERROR,
                payload: { msg: error.response.data.msg },
            })   
        }
        clearAlert()
    }

    const getJobs = async () => {
        let url = `/jobs`

        dispatch({ type: GET_JOBS_BEGIN })
        try{
            const { data } = await authFetch(url)
            const { jobs, totalJobs, numOfPages } = data
            dispatch({
                type: GET_JOBS_SUCCESS,
                payload: {
                    jobs,
                    totalJobs,
                    numOfPages,
                },
            })
        }
        catch(error) {
            console.log(error.response)
            //logoutUser()
        }
        //clears any previous alerts when moving to other pages since it does stay on the page for 3 seconds
        clearAlert()
    }

    const setEditJob = (id) => {
        dispatch({type:SET_EDIT_JOB, payload: { id }})
    }

    const editJob = async () => {
        dispatch({ type: EDIT_JOB_BEGIN })
        try {
            const { position, company, jobLocation, jobType, status} = state
            await authFetch.patch(`/jobs/${state.editJobId}`,{
                position, 
                company, 
                jobLocation, 
                jobType, 
                status
            })
            dispatch({ type: EDIT_JOB_SUCCESS })
            dispatch({ type: CLEAR_VALUES })
        } catch (error) {
            if(error.response.status === 401) {
                return
            }
            dispatch({
                type: EDIT_JOB_ERROR,
                payload: { msg: error.response.data.msg },

            })
        }
        clearAlert()
    }

    const deleteJob = async (jobId) => {
        dispatch({type:DELETE_JOB_BEGIN})
        try {
            await authFetch.delete(`/jobs/${jobId}`)
            getJobs()
        } catch (error) {
            console.log(error.response)
            // logoutUser()
        }

      
    }

    const showStats = async () => {
        dispatch({type:SHOW_STATS_BEGIN})
        try {
            const { data } = await authFetch('/jobs/stats')
            dispatch({
                type: SHOW_STATS_SUCCESS,
                payload: {
                    stats: data.defaultStats,
                    monthlyApplications: data.monthlyApplications,
                }
            })
            
        } catch (error) {
            console.log(error.response)
            // logoutUser()
        }
        clearAlert()
 
    }




    return (<AppContext.Provider
        value={{ ...state, displayAlert, registerUser, loginUser, toggleSidebar, logoutUser, updateUser, handleChange, clearValues, createJob, getJobs, setEditJob, deleteJob, editJob, showStats, }} >
        {children}
    </AppContext.Provider>)
}

//creates custom hook
const useAppContext = () => {
    return useContext(AppContext)
}


export { AppProvider, initialState, useAppContext }