import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const EditJob = () => {
    const { id } = useParams();
    const { user, loading: authLoading } = useContext(AuthContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        salary: '',
        location: '',
        companyName: '',
        jobType: 'Full-time'
    });

    useEffect(() => {
        if (!authLoading) {
            if (!user || user.role !== 'recruiter') {
                toast.error('Only recruiters can edit jobs');
                navigate('/dashboard');
            } else {
                fetchJobDetails();
            }
        }
    }, [user, authLoading, navigate, id]);

    const fetchJobDetails = async () => {
        try {
            const res = await axios.get(`/api/jobs/${id}`);
            const job = res.data;
            
            // Verify if the logged-in user is the owner of the job
            if (job.recruiter._id !== user._id) {
                toast.error('Not authorized to edit this job');
                navigate('/dashboard');
                return;
            }

            setFormData({
                title: job.title,
                description: job.description,
                salary: job.salary.toString(),
                location: job.location,
                companyName: job.companyName,
                jobType: job.jobType
            });
        } catch (error) {
            toast.error('Failed to load job details');
            navigate('/dashboard');
        } finally {
            setInitialLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const dataToSubmit = {
                ...formData,
                salary: Number(formData.salary)
            };
            await axios.put(`/api/jobs/${id}`, dataToSubmit);
            toast.success('Job updated successfully');
            navigate('/dashboard');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update job');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || initialLoading) {
        return (
            <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-white drop-shadow-md mb-8">Edit Job Posting</h1>

            <div className="glass-panel rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-indigo-100 mb-1">Job Title</label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Senior React Developer"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                className="block w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-indigo-300/50 shadow-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 sm:text-sm transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-indigo-100 mb-1">Company Name</label>
                            <input
                                type="text"
                                required
                                value={formData.companyName}
                                onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                className="block w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-indigo-300/50 shadow-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 sm:text-sm transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="block text-sm font-medium text-indigo-100 mb-1">Location</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="e.g. Remote, New York, NY"
                                    value={formData.location}
                                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                                    className="block w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-indigo-300/50 shadow-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 sm:text-sm transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-indigo-100 mb-1">Annual Salary ($)</label>
                                <input
                                    type="number"
                                    required
                                    min="0"
                                    placeholder="e.g. 120000"
                                    value={formData.salary}
                                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                                    className="block w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-indigo-300/50 shadow-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 sm:text-sm transition-all"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-indigo-100 mb-1">Job Type</label>
                            <select
                                value={formData.jobType}
                                onChange={(e) => setFormData({...formData, jobType: e.target.value})}
                                className="block w-full rounded-lg border border-white/20 bg-black/40 px-3 py-2 text-white shadow-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 sm:text-sm transition-all"
                            >
                                <option value="Full-time">Full-time</option>
                                <option value="Part-time">Part-time</option>
                                <option value="Contract">Contract</option>
                                <option value="Internship">Internship</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-indigo-100 mb-1">Job Description</label>
                            <textarea
                                required
                                rows="6"
                                placeholder="Describe the role, responsibilities, and requirements..."
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                className="block w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-indigo-300/50 shadow-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 sm:text-sm transition-all"
                            />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <button
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="bg-white/5 text-indigo-200 border border-white/20 font-medium py-2.5 px-6 rounded-lg shadow-sm hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 transition-colors mr-3"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-indigo-600/90 text-white font-medium py-2.5 px-6 rounded-lg border border-indigo-500/50 shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 transition-all"
                            >
                                {loading ? 'Updating...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditJob;
