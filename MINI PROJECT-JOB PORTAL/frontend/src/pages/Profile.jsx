import { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { User, Mail, Briefcase, FileText, Building } from 'lucide-react';

const Profile = () => {
    const { user, fetchUser } = useContext(AuthContext);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        skills: '',
        companyName: '',
        companyDescription: ''
    });
    const [resumeFile, setResumeFile] = useState(null);

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                skills: user.profile?.skills?.join(', ') || '',
                companyName: user.profile?.companyName || '',
                companyDescription: user.profile?.companyDescription || ''
            });
        }
    }, [user]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            
            if (user.role === 'seeker') {
                submitData.append('skills', formData.skills);
                if (resumeFile) {
                    submitData.append('resumeFile', resumeFile);
                }
            } else if (user.role === 'recruiter') {
                submitData.append('companyName', formData.companyName);
                submitData.append('companyDescription', formData.companyDescription);
            }

            await axios.put('/api/users/profile', submitData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            toast.success('Profile updated successfully');
            fetchUser(); // Refresh user data
            setResumeFile(null); // Clear file input
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
            <h1 className="text-3xl font-bold text-white drop-shadow-md mb-8">Your Profile</h1>

            <div className="glass-panel shadow-2xl rounded-2xl overflow-hidden">
                <div className="p-6 md:p-8 border-b border-white/10 bg-white/5 flex items-center gap-4">
                    <div className="bg-indigo-500/20 p-4 rounded-full">
                        <User className="h-10 w-10 text-indigo-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                        <span className="inline-flex items-center px-3 py-1 mt-2 rounded-full text-xs font-medium bg-white/10 text-indigo-200 capitalize backdrop-blur-sm border border-white/10">
                            {user.role} Account
                        </span>
                    </div>
                </div>

                <div className="p-6 md:p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Common Fields */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                            <div>
                                <label className="flex items-center text-sm font-medium text-indigo-100 mb-1">
                                    <User className="w-4 h-4 mr-1 text-indigo-300" /> Full Name
                                </label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    className="block w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-indigo-300/50 shadow-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 sm:text-sm transition-all"
                                />
                            </div>
                            <div>
                                <label className="flex items-center text-sm font-medium text-indigo-100 mb-1">
                                    <Mail className="w-4 h-4 mr-1 text-indigo-300" /> Email
                                </label>
                                <input
                                    type="email"
                                    disabled
                                    value={user.email}
                                    className="block w-full rounded-lg border border-white/10 bg-black/20 px-3 py-2 text-gray-400 sm:text-sm cursor-not-allowed"
                                />
                            </div>
                        </div>

                        {/* Seeker Specific Fields */}
                        {user.role === 'seeker' && (
                            <>
                                <div>
                                    <label className="flex items-center text-sm font-medium text-indigo-100 mb-1">
                                        <Briefcase className="w-4 h-4 mr-1 text-indigo-300" /> Skills (comma separated)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. React, Node.js, Python"
                                        value={formData.skills}
                                        onChange={(e) => setFormData({...formData, skills: e.target.value})}
                                        className="block w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-indigo-300/50 shadow-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 sm:text-sm transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center text-sm font-medium text-indigo-100 mb-1">
                                        <FileText className="w-4 h-4 mr-1 text-indigo-300" /> Resume (PDF/Doc)
                                    </label>
                                    <input
                                        type="file"
                                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                        onChange={(e) => setResumeFile(e.target.files[0])}
                                        className="block w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white shadow-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 sm:text-sm cursor-pointer"
                                    />
                                    {user.profile?.resumeUrl && (
                                        <div className="mt-2 text-sm">
                                            <span className="text-gray-400">Current Resume: </span>
                                            <a href={user.profile.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 inline-flex items-center transition-colors">
                                                View Saved File <ExternalLink className="h-3 w-3 ml-1" />
                                            </a>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Recruiter Specific Fields */}
                        {user.role === 'recruiter' && (
                            <>
                                <div>
                                    <label className="flex items-center text-sm font-medium text-indigo-100 mb-1">
                                        <Building className="w-4 h-4 mr-1 text-indigo-300" /> Company Name
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.companyName}
                                        onChange={(e) => setFormData({...formData, companyName: e.target.value})}
                                        className="block w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-indigo-300/50 shadow-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 sm:text-sm transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="flex items-center text-sm font-medium text-indigo-100 mb-1">
                                        <FileText className="w-4 h-4 mr-1 text-indigo-300" /> Company Description
                                    </label>
                                    <textarea
                                        rows="4"
                                        value={formData.companyDescription}
                                        onChange={(e) => setFormData({...formData, companyDescription: e.target.value})}
                                        className="block w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 text-white placeholder-indigo-300/50 shadow-sm focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 sm:text-sm transition-all"
                                    />
                                </div>
                            </>
                        )}

                        <div className="pt-4 flex justify-end">
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-indigo-600/90 text-white font-medium py-2.5 px-8 rounded-lg border border-indigo-500/50 shadow-lg hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900 disabled:opacity-50 transition-all duration-300"
                            >
                                {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Profile;
