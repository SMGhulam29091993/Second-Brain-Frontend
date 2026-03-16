import { ComponentType, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { AddContentModal } from '../sharedComponents/addContentModal.component';
import { Header } from '../sharedComponents/header.component';
import { Sidebar } from './sidebar';
import { ShareModal } from '../sharedComponents/shareModal.component';
import api from '../../config/axios.config';
import toast from 'react-hot-toast';
import { HomeIcon } from '../../icons/HomeIcon';
import { ShareIcon } from '../../icons/ShareIcons';
import { PlusIcon } from '../../icons/PlusIcons';
import { useSourceStore } from '../../store/sourceStore';

export function AppLayout<T extends object>(WrappedComponent: ComponentType<T>) {
    return (props: any) => {
        const navigate = useNavigate();
        const [open, setOpen] = useState<boolean>(false);
        const [shareOpen, setShareOpen] = useState<boolean>(false);
        const [shareLink, setShareLink] = useState<string>('');
        const source = useSourceStore((state) => state.source);

        const handleShareBrain = async () => {
            try {
                const resp = await api.post(`/link/brain-link`, { shareBrain: true });
                if (resp.data?.data?.link) {
                    setShareLink(resp.data.data.link);
                    setShareOpen(true);
                } else {
                    toast.error('Failed to generate share link');
                }
            } catch (error) {
                toast.error('Error creating share link');
            }
        };

        const handleHomeClick = () => {
            useSourceStore.getState().setSource('');
            navigate('/dashboard');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };

        return (
            <div className="min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
                <Header />
                
                <Sidebar 
                    onAddContent={() => setOpen(true)}
                />
                
                <AddContentModal open={open} onClose={() => setOpen(false)} />
                <ShareModal 
                    open={shareOpen} 
                    onClose={() => setShareOpen(false)} 
                    shareLink={shareLink} 
                />
                
                <main className="px-4 sm:pl-28 md:pl-72 pt-32 sm:pt-24 pb-24 sm:pb-8 transition-all duration-300">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="max-w-7xl mx-auto"
                    >
                        <WrappedComponent {...props} setOpen={setOpen} />
                    </motion.div>
                </main>

                {/* Mobile Bottom Navigation Bar */}
                <div 
                    onClick={(e) => e.stopPropagation()}
                    className="fixed bottom-0 left-0 right-0 h-16 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 flex items-center justify-around px-6 sm:hidden z-50 pointer-events-auto"
                >
                    <MobileNavItem 
                        icon={<PlusIcon />} 
                        label="Add" 
                        onClick={() => setOpen(true)}
                    />
                    
                    <MobileNavItem 
                        icon={<HomeIcon />} 
                        label="Home" 
                        active={!source}
                        onClick={handleHomeClick}
                    />
                </div>
            </div>
        );
    };
}

const MobileNavItem = ({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick: (e: React.MouseEvent) => void }) => (
    <button 
        onClick={(e) => {
            e.stopPropagation();
            onClick(e);
        }}
        className={`flex flex-col items-center justify-center gap-1 cursor-pointer transition-colors ${active ? 'text-blue-600' : 'text-slate-500 dark:text-slate-400'}`}
    >
        <span className="scale-90">{icon}</span>
        <span className="text-[10px] font-bold">{label}</span>
    </button>
);
