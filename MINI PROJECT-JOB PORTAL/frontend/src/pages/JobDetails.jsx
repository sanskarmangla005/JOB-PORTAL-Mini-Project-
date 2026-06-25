import { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { MapPin, DollarSign, Building, Clock, Briefcase, Star } from 'lucide-react';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [resumeFile, setResumeFile] = useState(null);
    const [hasApplied, setHasApplied] = useState(false);
    const [showRatingModal, setShowRatingModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`/api/jobs/${id}`);
                setJob(res.data);
            } catch (error) {
                console.error(error);
                toast.error('Failed to load job details');
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id]);

    const handleApply = async () => {
        if (!user) {
            navigate('/login', { state: { from: { pathname: `/jobs/${id}` } } });
            return;
        }

        if (user.role === 'recruiter') {
            toast.error('Recruiters cannot apply for jobs');
            return;
        }

        try {
            setApplying(true);
            
            const formData = new FormData();
            if (resumeFile) {
                formData.append('resumeFile', resumeFile);
            }

            await axios.post(`/api/jobs/${id}/apply`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Successfully applied for this job!');
            setHasApplied(true);
            // Ideally we'd reflect this state locally to prevent double clicks
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to apply');
        } finally {
            setApplying(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-20 text-center glass-panel mt-10 rounded-2xl">
                <h2 className="text-2xl font-bold text-white mb-4">Job not found</h2>
                <Link to="/jobs" className="text-indigo-400 hover:text-indigo-300">Back to all jobs</Link>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <button 
                onClick={(e) => {
                    e.preventDefault();
                    if (hasApplied) {
                        setShowRatingModal(true);
                    } else {
                        navigate("/jobs");
                    }
                }} 
                className="text-sm text-indigo-300 hover:text-indigo-100 mb-6 flex items-center font-medium transition-colors"
                title="Back to jobs"
            >
                &larr; Back to jobs
            </button>

            <div className="glass-panel rounded-2xl shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="p-6 md:p-8 border-b border-white/10 bg-white/5">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div>
                            <h1 className="text-3xl font-bold text-white drop-shadow-md mb-2">{job.title}</h1>
                            <div className="flex flex-wrap items-center gap-4 text-indigo-200">
                                <span className="flex items-center">
                                    <Building className="h-5 w-5 mr-1 text-indigo-400" />
                                    {job.companyName}
                                </span>
                                <span className="flex items-center">
                                    <MapPin className="h-5 w-5 mr-1 text-indigo-400" />
                                    {job.location}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col gap-3 min-w-[250px]">
                            {user && user.role === 'seeker' && (
                                <div className="space-y-1">
                                    <label className="block text-sm font-medium text-indigo-100">Upload Resume (Optional)</label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={(e) => setResumeFile(e.target.files[0])}
                                        className="w-full px-3 py-2 border border-white/20 bg-white/5 text-white rounded-md focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 text-sm cursor-pointer"
                                    />
                                </div>
                            )}
                            <button
                                onClick={handleApply}
                                disabled={applying || (user && user.role === 'recruiter')}
                                className="w-full bg-indigo-600/90 border border-indigo-500/50 text-white font-semibold py-3 px-6 rounded-lg shadow-lg hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                                {applying ? 'Applying...' : 'Apply Now'}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Details grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 border-b border-white/10">
                    <div className="p-6 border-b md:border-b-0 md:border-r border-white/10 flex items-start gap-4">
                        <DollarSign className="h-8 w-8 text-indigo-400 shrink-0" />
                        <div>
                            <p className="text-sm text-indigo-300 font-medium">Salary</p>
                            <p className="text-lg font-semibold text-white">${job.salary?.toLocaleString()}</p>
                        </div>
                    </div>
                    <div className="p-6 border-b md:border-b-0 md:border-r border-white/10 flex items-start gap-4">
                        <Briefcase className="h-8 w-8 text-indigo-400 shrink-0" />
                        <div>
                            <p className="text-sm text-indigo-300 font-medium">Job Type</p>
                            <p className="text-lg font-semibold text-white">{job.jobType}</p>
                        </div>
                    </div>
                    <div className="p-6 flex items-start gap-4">
                        <Clock className="h-8 w-8 text-indigo-400 shrink-0" />
                        <div>
                            <p className="text-sm text-indigo-300 font-medium">Posted</p>
                            <p className="text-lg font-semibold text-white">
                                {new Date(job.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Description */}
                <div className="p-6 md:p-8">
                    <h3 className="text-xl font-bold text-white mb-4">Job Description</h3>
                    <div className="prose max-w-none text-indigo-100/90 whitespace-pre-line">
                        {job.description}
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/10">
                        <h3 className="text-xl font-bold text-white mb-4">About {job.companyName}</h3>
                        <p className="text-indigo-100/90 whitespace-pre-line">
                            {job.recruiter?.profile?.companyDescription || 'No company description provided.'}
                        </p>
                    </div>
                </div>
            </div>

            {/* Rating Modal */}
            {showRatingModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-slate-900 border border-white/10 p-8 rounded-2xl shadow-2xl max-w-sm w-full text-center transform transition-all animate-in fade-in zoom-in duration-200">
                        <h3 className="text-2xl font-bold text-white mb-2">Rate your experience</h3>
                        <p className="text-gray-400 mb-6 text-sm">How easy was it to apply for this job?</p>
                        
                        <div className="flex justify-center gap-2 mb-8">
                            {[1, 2, 3, 4, 5].map((starIdx) => (
                                <button
                                    key={starIdx}
                                    onMouseEnter={() => setHoverRating(starIdx)}
                                    onMouseLeave={() => setHoverRating(0)}
                                    onClick={() => setRating(starIdx)}
                                    className="focus:outline-none transition-transform hover:scale-110"
                                >
                                    <Star 
                                        className={`w-10 h-10 ${
                                            (hoverRating || rating) >= starIdx 
                                            ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]' 
                                            : 'text-gray-700 hover:text-gray-500'
                                        }`} 
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="flex flex-col gap-3">
                            <button
                                onClick={() => {
                                    if(rating > 0) {
                                        toast.success("Thank you for your feedback!");
                                        setShowRatingModal(false);
                                        navigate("/jobs");
                                    } else {
                                        toast.error("Please select a rating first!");
                                    }
                                }}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-xl transition-colors shadow-lg shadow-indigo-500/30"
                            >
                                Submit Rating
                            </button>
                            <button
                                onClick={() => {
                                    setShowRatingModal(false);
                                    navigate("/jobs");
                                }}
                                className="w-full bg-transparent hover:bg-white/5 text-gray-400 font-medium py-3 rounded-xl transition-colors border border-transparent hover:border-white/10"
                            >
                                Skip
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default JobDetails;
