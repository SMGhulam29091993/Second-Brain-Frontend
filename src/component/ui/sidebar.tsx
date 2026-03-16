import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { HomeIcon } from '../../icons/HomeIcon';
import { PlusIcon } from '../../icons/PlusIcons';
import { YoutubeIcon } from '../../icons/YoutubeIcons';
import { TwitterIcon } from '../../icons/TwitterIcon';
import { FacebookIcon } from '../../icons/FacebookIcon';
import { GithubIcon } from '../../icons/GithubIcon';
import api from '../../config/axios.config';
import { useSourceStore } from '../../store/sourceStore';

interface SidebarProps {
    onAddContent?: () => void;
}

interface SourceDto {
    _id: string;
    name: string;
}

export const Sidebar = ({ onAddContent }: SidebarProps) => {
    const navigate = useNavigate();
    const setSourceStore = useSourceStore((state) => state.setSource);
    const activeSource = useSourceStore((state) => state.source);

    const { data: allSourceData } = useQuery({
        queryKey: ['allSource'],
        queryFn: async () => {
            const response = await api.get('/content/get-all-sources');
            return response.data;
        },
    });

    const sources = allSourceData?.data || [];

    const getSourceIcon = (name: string) => {
        switch (name.toLowerCase()) {
            case 'youtube': return <YoutubeIcon />;
            case 'twitter': return <TwitterIcon />;
            case 'facebook': return <FacebookIcon />;
            case 'github': return <GithubIcon />;
            default: return null;
        }
    };

    const handleAllMemoriesClick = () => {
        setSourceStore('');
        navigate('/dashboard');
    };

    const handleSourceClick = (sourceName: string) => {
        setSourceStore(sourceName);
        navigate('/dashboard');
    };

    return (
        <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="fixed left-6 top-24 bottom-6 w-20 md:w-64 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-4 shadow-2xl z-40 hidden sm:flex flex-col"
        >
            <div className="flex-1 flex flex-col gap-2">
                <SidebarItem 
                    icon={<HomeIcon />} 
                    label="All Memories" 
                    active={!activeSource} 
                    onClick={handleAllMemoriesClick}
                />
                
                <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-4" />

                {/* Dynamic Sources */}
                <div className="flex flex-col gap-1 overflow-y-auto max-h-[50vh] scrollbar-hide">
                    {sources.map((source: SourceDto) => (
                        <SidebarItem
                            key={source._id}
                            icon={getSourceIcon(source.name)}
                            label={source.name.charAt(0).toUpperCase() + source.name.slice(1)}
                            active={activeSource === source.name}
                            onClick={() => handleSourceClick(source.name)}
                        />
                    ))}
                </div>

                <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-4" />

                <SidebarItem 
                    icon={<PlusIcon />} 
                    label="Add Content" 
                    onClick={onAddContent}
                    className="mt-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400"
                />
            </div>

            <div className="mt-auto p-2">
                <div className="bg-slate-50 dark:bg-slate-800/50 rounded-3xl p-4 hidden md:block border border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-relaxed font-bold">
                        SecondBrain v1.0
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

interface SidebarItemProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    onClick?: () => void;
    className?: string;
}

const SidebarItem = ({ icon, label, active, onClick, className = '' }: SidebarItemProps) => {
    return (
        <motion.button
            whileHover={{ scale: 1.02, x: 5 }}
            whileTap={{ scale: 0.98 }}
            onClick={onClick}
            className={`
                w-full flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 cursor-pointer
                ${active 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-blue-600 dark:hover:text-blue-400'
                }
                ${className}
            `}
        >
            <span className="flex-shrink-0">{icon}</span>
            <span className="font-bold text-sm hidden md:block">{label}</span>
        </motion.button>
    );
};
