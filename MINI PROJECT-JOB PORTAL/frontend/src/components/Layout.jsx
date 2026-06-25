import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Toaster } from 'react-hot-toast';


const Layout = () => {
    return (
        <div className="min-h-screen flex flex-col bg-transparent text-gray-200">
            <Toaster position="top-right" />
            <Navbar />
            <main className="flex-grow">
                <Outlet />
            </main>
            <footer className="mt-auto py-6 mb-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-3">
                    <p className="text-center text-sm text-gray-400 font-medium">
                        &copy; {new Date().getFullYear()} JobPortal. All rights reserved.
                    </p>

                </div>
            </footer>

        </div>
    );
};

export default Layout;
