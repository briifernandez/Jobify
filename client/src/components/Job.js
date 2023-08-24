import moment from 'moment'
import { FaLocationArrow, FaBriefcase, FaCalendarAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useAppContext } from '../context/appContext';
import Wrapper from '../assets/wrappers/Job';
import JobInfo from './JobInfo';


 
const Job = ({
    _id, 
    position, 
    company, 
    jobLocation, 
    jobType, 
    createdAt, 
    status
}) => {
    const { setEditJob, deleteJob } = useAppContext()

    let date = moment(createdAt)
    date = date.format('MMM Do, YYYY')
  return (
    <Wrapper>
        <header>
            <div className='main-icon'>{company.charAt(0)}</div>
            <div className='info'>
                <h5>{position}</h5> 
                <p>{company}</p>

            </div>
        </header>

        <div className='content'>
            {/* content center */}
            <div className='content-center'>
                <JobInfo icon={<FaLocationArrow />} text ={jobLocation} />
                <JobInfo icon={<FaCalendarAlt />} text ={date} />
                <JobInfo icon={<FaBriefcase />} text ={jobType} />
                <div className={`status ${status}`}>{status}</div>
            </div>

            <footer>
                <div className='actions'>
                    <Link 
                        to='/add-job' 
                        className='btn edit-btn'
                        onClick={() => setEditJob (_id)}
                        >
                        Edit
                    </Link>
                    {/* onClick has to be an arrow function since we do not want to execute deleteJob right away when the component renders, instead we want to execute it when we click the button */}
                    <button 
                        type='button' 
                        className='btn delete-btn' 
                        onClick={() => deleteJob(_id)}
                        >
                        Delete
                    </button>
                </div>
            </footer>
        </div>
        

    </Wrapper>

  )
}
export default Job