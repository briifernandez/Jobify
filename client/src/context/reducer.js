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

import { initialState } from "./appContext"

const reducer = (state, action) => {
    if(action.type === DISPLAY_ALERT) {
       return {
        ...state,
        showAlert: true,
        alertType: 'danger', 
        alertText: 'Please provide all values!', } 
    }
    if(action.type === CLEAR_ALERT) {
        return {
         ...state,
         showAlert: false,
         alertType: '', 
         alertText: '', } 
     }
    if(action.type === REGISTER_USER_BEGIN) {
        return { ...state, isLoading: true}
    }

    if(action.type === REGISTER_USER_SUCCESS) {
        return { 
            ...state, 
            isLoading: false, 
            token: action.payload.token, 
            user: action.payload.user, 
            userLocation: action.payload.location, 
            jobLocation: action.payload.location,
            showAlert: true,
            alertType: 'success',
            alertText: 'User Created! Redirecting...'
        }
    }

    if(action.type === REGISTER_USER_ERROR) {
        return { 
            ...state, 
            isLoading: false, 
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg,
        }
    }


    if(action.type === LOGIN_USER_BEGIN) {
        return { ...state, isLoading: true}
    }

    if(action.type === LOGIN_USER_SUCCESS) {
        return { 
            ...state, 
            isLoading: false, 
            token: action.payload.token, 
            user: action.payload.user, 
            userLocation: action.payload.location, 
            jobLocation: action.payload.location,
            showAlert: true,
            alertType: 'success',
            alertText: 'Login Successful! Redirecting...'
        }
    }

    if(action.type === LOGIN_USER_ERROR) {
        return { 
            ...state, 
            isLoading: false, 
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg,
        }
    }

    if(action.type === TOGGLE_SIDEBAR) {
        return { 
            ...state, 
            showSidebar: !state.showSidebar,

        }
    }

    if(action.type === LOGOUT_USER) {
        return {
            ...initialState,
            user: null,
            token: null,
            jobLocation: '',
            userLocation: '',
        }

    }

    if(action.type === UPDATE_USER_BEGIN) {
        return { ...state, isLoading: true}
    }

    //we would have to set token,user and locations again from scratch
    if(action.type === UPDATE_USER_SUCCESS) {
        return { 
            ...state, 
            isLoading: false, 
            token: action.payload.token, 
            user: action.payload.user, 
            userLocation: action.payload.location, 
            jobLocation: action.payload.location,
            showAlert: true,
            alertType: 'success',
            alertText: 'User Profile Updated!'
        }
    }

    if(action.type === UPDATE_USER_ERROR) {
        return { 
            ...state, 
            isLoading: false, 
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg,
        }
    }
    if(action.type === HANDLE_CHANGE) {
        return { 
            ...state, 
            //dynamically changes the state based on what you type
            //you can see on the components section of the inspect
            [action.payload.name]: action.payload.value,

        }
    }

    if(action.type === CLEAR_VALUES) {

        const initialState = {
            isEditing: false,
            editJobId: '',
            position: '',
            company: '',
            jobLocation: state.userLocation,
            jobType: 'full-time',
            status: 'pending', 
        }
        return { 
            ...state, 
            ...initialState,

        }
    }

    if(action.type === CREATE_JOB_BEGIN) {
        return {...state, isLoading: true}
    }

    if(action.type === CREATE_JOB_SUCCESS) {
        return {
            ...state, 
            isLoading: false,
            showAlert: true,
            alertType: 'success',
            alertText: 'New Job Created!'
        }
    }

    if(action.type === CREATE_JOB_ERROR) {
        return {
            ...state, 
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg,
        }
    }

    if (action.type === GET_JOBS_BEGIN) {
        return {
            ...state,
            isLoading: true,
            //clears any previous alerts when moving to other pages since it does stay on the page for 3 seconds
            showAlert: false
        }
    }

    if (action.type === GET_JOBS_SUCCESS) {
        return {
            ...state,
            isLoading: false,
            jobs: action.payload.jobs,
            totalJobs: action.payload.totalJobs,
            numOfPages: action.payload.numOfPages,
        }
    }

    if(action.type === SET_EDIT_JOB) {
        const job = state.jobs.find((job) => job._id === action.payload.id)
        const {_id, position, company, jobLocation, jobType, status} = job

        //all state values below will be equal to the values of the current job
        return {
            ...state,
            isEditing: true,
            editJobId: _id,
            position,
            company,
            jobLocation,
            jobType,
            status,
        }
    }

    if(action.type === DELETE_JOB_BEGIN) {
        return {...state, isLoading: true}
    }


    if (action.type === EDIT_JOB_BEGIN) {
        return{
            ...state,
            isLoading: true,
    
        }
    }

    if (action.type === EDIT_JOB_SUCCESS) {
        return{
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'success',
            alertText: 'Job Updated!'
        }
    }

    if (action.type === EDIT_JOB_ERROR) {
        return{
            ...state,
            isLoading: false,
            showAlert: true,
            alertType: 'danger',
            alertText: action.payload.msg,
        }
    }
     

    if (action.type === SHOW_STATS_BEGIN) {
        return{
            ...state,
            isLoading: true,
            showAlert: false,
    
        }
    }

    if (action.type === SHOW_STATS_SUCCESS) {
        return{
            ...state,
            isLoading: false,
            stats: action.payload.stats,
            monthlyApplications: action.payload.monthlyApplications,
   
        }
    }

    throw new Error(`no such action: ${action.type}`)
}

export default reducer