import { Link } from 'react-router-dom';
import { Search, Briefcase, Building } from 'lucide-react';

const Home = () => {
    return (
        <div>
            {/* Hero Section */}
            <div className="text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 mix-blend-overlay"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32 relative z-10">
                    <div className="text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-indigo-200 drop-shadow-sm">
                            Find Your Dream Job Today
                        </h1>
                        <p className="mt-4 text-xl md:text-2xl text-indigo-200/90 max-w-3xl mx-auto mb-10 font-light">
                            Connecting talented professionals with top companies. Explore thousands of job opportunities.
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-5">
                            <Link to="/jobs" className="bg-white text-indigo-900 hover:bg-indigo-50 font-semibold py-3.5 px-8 rounded-full text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                Browse Jobs
                            </Link>
                            <Link to="/signup" className="border border-indigo-300 hover:bg-white/10 hover:border-white text-white font-semibold py-3.5 px-8 rounded-full text-lg backdrop-blur-sm transition-all duration-300 transform hover:-translate-y-1">
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Section */}
            <div className="py-12 border-y border-white/10 glass-panel">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center relative z-10">
                        <div className="p-6">
                            <Briefcase className="w-12 h-12 text-indigo-400 mx-auto mb-4 drop-shadow-md" />
                            <h3 className="text-3xl font-bold text-white">10,000+</h3>
                            <p className="text-indigo-200 mt-2 text-lg font-light">Active Jobs</p>
                        </div>
                        <div className="p-6 border-t border-b md:border-t-0 md:border-b-0 md:border-l md:border-r border-indigo-500/20">
                            <Building className="w-12 h-12 text-indigo-400 mx-auto mb-4 drop-shadow-md" />
                            <h3 className="text-3xl font-bold text-white">1,500+</h3>
                            <p className="text-indigo-200 mt-2 text-lg font-light">Companies</p>
                        </div>
                        <div className="p-6">
                            <Search className="w-12 h-12 text-indigo-400 mx-auto mb-4 drop-shadow-md" />
                            <h3 className="text-3xl font-bold text-white">100k+</h3>
                            <p className="text-indigo-200 mt-2 text-lg font-light">Active Users</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Info */}
            <div className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-white tracking-wide">Why choose JobPortal?</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                        <div className="glass-card p-8 rounded-2xl hover:border-indigo-400/50 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
                            <h3 className="text-xl font-bold mb-3 text-indigo-100">For Job Seekers</h3>
                            <p className="text-indigo-200/80 font-light leading-relaxed">Create a profile, upload your resume, and apply to jobs with a single click. Track your application status in real-time.</p>
                        </div>
                        <div className="glass-card p-8 rounded-2xl hover:border-indigo-400/50 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
                            <h3 className="text-xl font-bold mb-3 text-indigo-100">For Employers</h3>
                            <p className="text-indigo-200/80 font-light leading-relaxed">Post jobs, manage applications, and find the best candidates using our streamlined recruiter dashboard.</p>
                        </div>
                        <div className="glass-card p-8 rounded-2xl hover:border-indigo-400/50 hover:bg-white/10 transition-all duration-300 transform hover:-translate-y-2">
                            <h3 className="text-xl font-bold mb-3 text-indigo-100">Fast & Secure</h3>
                            <p className="text-indigo-200/80 font-light leading-relaxed">Built with modern web technologies, ensuring a fast browsing experience and comprehensive data security.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;
