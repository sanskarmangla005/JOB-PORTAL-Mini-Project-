import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Search, MapPin, DollarSign, Building } from 'lucide-react';

const Jobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [keyword, setKeyword] = useState('');

    const fetchJobs = async (searchQuery = '') => {
        try {
            setLoading(true);
            const res = await axios.get(`/api/jobs${searchQuery ? `?keyword=${searchQuery}` : ''}`);
            setJobs(res.data);
        } catch (error) {
            console.error('Error fetching jobs', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        fetchJobs(keyword);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
                <h1 className="text-3xl font-bold text-white mb-4 md:mb-0 drop-shadow-md">Browse Jobs</h1>
                
                {/* Search Bar */}
                <form onSubmit={handleSearch} className="flex w-full md:w-auto shadow-lg rounded-md">
                    <div className="relative flex-grow md:w-80">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-indigo-300" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search by title, company, or keywords..."
                            value={keyword}
                            onChange={(e) => setKeyword(e.target.value)}
                            className="block w-full pl-10 pr-3 py-2.5 border border-white/20 rounded-l-lg leading-5 bg-white/5 text-white placeholder-indigo-300/50 focus:outline-none focus:ring-1 focus:ring-indigo-400 focus:border-indigo-400 sm:text-sm backdrop-blur-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-indigo-600/90 text-white px-5 py-2.5 border border-indigo-500/50 rounded-r-lg hover:bg-indigo-500 transition-colors backdrop-blur-sm font-medium"
                    >
                        Search
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            ) : jobs.length === 0 ? (
                <div className="text-center py-12 glass-panel rounded-2xl">
                    <h3 className="text-lg font-medium text-white">No jobs found</h3>
                    <p className="mt-1 text-indigo-200">Try adjusting your search criteria.</p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {jobs.map((job) => (
                        <div key={job._id} className="glass-card rounded-2xl hover:border-indigo-400/50 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-1 p-6 flex flex-col group">
                            <div className="flex-grow">
                                <h2 className="text-xl font-semibold text-white mb-2 line-clamp-2 group-hover:text-indigo-300 transition-colors">{job.title}</h2>
                                <div className="space-y-2 mb-4">
                                    <div className="flex items-center text-indigo-200/90 text-sm font-light">
                                        <Building className="h-4 w-4 mr-2 text-indigo-400" />
                                        {job.companyName}
                                    </div>
                                    <div className="flex items-center text-indigo-200/90 text-sm font-light">
                                        <MapPin className="h-4 w-4 mr-2 text-indigo-400" />
                                        {job.location}
                                    </div>
                                    <div className="flex items-center text-indigo-200/90 text-sm font-light">
                                        <DollarSign className="h-4 w-4 mr-2 text-indigo-400" />
                                        ${job.salary?.toLocaleString() || 'Not specified'}
                                    </div>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-200 border border-indigo-500/30 backdrop-blur-sm">
                                        {job.jobType}
                                    </span>
                                </div>
                            </div>
                            <div className="mt-6 pt-4 border-t border-white/10">
                                <Link
                                    to={`/jobs/${job._id}`}
                                    className="w-full flex justify-center items-center px-4 py-2 border border-indigo-400/50 rounded-lg shadow-sm text-sm font-medium text-indigo-100 bg-white/5 hover:bg-indigo-500/20 hover:text-white transition-all duration-300"
                                >
                                    View Details
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Jobs;
