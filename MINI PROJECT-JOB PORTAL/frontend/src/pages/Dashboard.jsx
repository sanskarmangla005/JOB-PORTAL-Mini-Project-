import { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { Briefcase, Eye, Trash2, Edit } from 'lucide-react';

const Dashboard = () => {
    const { user, loading: authLoading } = useContext(AuthContext);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login');
        }
    }, [user, authLoading, navigate]);

    useEffect(() => {
        if (user) {
            fetchDashboardData();
        }
    }, [user]);

    const fetchDashboardData = async () => {
        try {
            if (user.role === 'seeker') {
                const res = await axios.get('/api/applications');
                setData(res.data);
            } else if (user.role === 'recruiter') {
                const res = await axios.get('/api/jobs');
                const recruiterJobs = res.data.filter(j => j.recruiter && j.recruiter._id === user._id);
                setData(recruiterJobs);
            }
        } catch (error) {
            toast.error('Failed to load dashboard data');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await axios.delete(`/api/jobs/${jobId}`);
                toast.success('Job deleted successfully');
                fetchDashboardData();
            } catch (error) {
                toast.error('Failed to delete job');
            }
        }
    };

    if (authLoading || loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-white mb-8">Dashboard</h1>

            {user.role === 'seeker' ? (
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-200 drop-shadow-sm">Your Applied Jobs</h2>
                    {data.length === 0 ? (
                        <div className="glass-panel p-8 rounded-2xl text-center">
                            <Briefcase className="w-12 h-12 text-indigo-400 mx-auto mb-4 drop-shadow-sm" />
                            <h3 className="text-lg font-medium text-white mb-2">No applications yet</h3>
                            <p className="text-indigo-200 mb-6">You haven't applied to any jobs yet. Start exploring!</p>
                            <Link to="/jobs" className="bg-indigo-600/90 border border-indigo-500/50 text-white px-6 py-2 rounded-lg font-medium hover:bg-indigo-500 transition-colors shadow-lg">
                                Browse Jobs
                            </Link>
                        </div>
                    ) : (
                        <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
                            <ul className="divide-y divide-white/10">
                                {data.map((app) => (
                                    <li key={app._id} className="p-4 sm:p-6 hover:bg-white/5 flex flex-col sm:flex-row justify-between sm:items-center transition-colors">
                                        <div>
                                            <h4 className="text-lg font-medium text-indigo-300 hover:text-indigo-100 transition-colors">
                                                <Link to={`/jobs/${app.job._id}`}>{app.job.title}</Link>
                                            </h4>
                                            <p className="text-indigo-100 mt-1">{app.job.companyName} • {app.job.location}</p>
                                            <p className="text-sm text-indigo-300 mt-2">
                                                Applied on: {new Date(app.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="mt-4 sm:mt-0">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium capitalize border backdrop-blur-sm
                                                ${app.status === 'pending' ? 'bg-yellow-500/20 text-yellow-200 border-yellow-500/30' :
                                                app.status === 'accepted' ? 'bg-green-500/20 text-green-200 border-green-500/30' :
                                                app.status === 'rejected' ? 'bg-red-500/20 text-red-200 border-red-500/30' :
                                                'bg-indigo-500/20 text-indigo-200 border-indigo-500/30'}`}
                                            >
                                                {app.status}
                                            </span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-semibold text-gray-200 drop-shadow-sm">Your Posted Jobs</h2>
                        <Link to="/jobs/new" className="bg-indigo-600/90 border border-indigo-500/50 text-white px-4 py-2 text-sm rounded-lg font-medium hover:bg-indigo-500 transition-colors shadow-lg">
                            Post New Job
                        </Link>
                    </div>

                    {data.length === 0 ? (
                        <div className="glass-panel p-8 rounded-2xl text-center">
                            <Briefcase className="w-12 h-12 text-indigo-400 mx-auto mb-4 drop-shadow-sm" />
                            <h3 className="text-lg font-medium text-white mb-2">No jobs posted</h3>
                            <p className="text-indigo-200 mb-6">You haven't posted any jobs yet. Create your first job posting!</p>
                        </div>
                    ) : (
                        <div className="glass-panel rounded-2xl overflow-hidden shadow-2xl">
                            <ul className="divide-y divide-white/10">
                                {data.map((job) => (
                                    <li key={job._id} className="p-4 sm:p-6 hover:bg-white/5 flex flex-col sm:flex-row justify-between sm:items-center transition-colors">
                                        <div>
                                            <h4 className="text-lg font-medium text-white hover:text-indigo-300 transition-colors">
                                                <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                                            </h4>
                                            <p className="text-indigo-100 mt-1">{job.location} • {job.jobType}</p>
                                            <p className="text-sm text-indigo-300 mt-2">
                                                Posted: {new Date(job.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div className="mt-4 sm:mt-0 flex gap-3">
                                            <Link 
                                                to={`/jobs/${job._id}/applicants`}
                                                className="inline-flex items-center text-indigo-200 bg-indigo-500/20 border border-indigo-500/30 hover:bg-indigo-500/40 hover:text-white px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                                            >
                                                <Eye className="w-4 h-4 mr-1.5"/>
                                                Applicants
                                            </Link>
                                            <Link 
                                                to={`/jobs/${job._id}/edit`}
                                                className="inline-flex items-center text-blue-200 bg-blue-500/20 border border-blue-500/30 hover:bg-blue-500/40 hover:text-white px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                                            >
                                                <Edit className="w-4 h-4 mr-1.5"/>
                                                Edit
                                            </Link>
                                            <button 
                                                onClick={() => handleDeleteJob(job._id)}
                                                className="inline-flex items-center text-red-200 bg-red-500/20 border border-red-500/30 hover:bg-red-500/40 hover:text-white px-3 py-1.5 rounded-lg transition-colors text-sm font-medium"
                                            >
                                                <Trash2 className="w-4 h-4 mr-1.5"/>
                                                Delete
                                            </button>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Dashboard;
