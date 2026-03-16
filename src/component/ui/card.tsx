/* eslint-disable @typescript-eslint/no-unused-vars */
import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DeleteIcon } from '../../icons/DeleteIcons';
import { SummaryIcon } from '../../icons/SummaryIcon';
import { motion, AnimatePresence } from 'framer-motion';

import { FacebookIcon } from '../../icons/FacebookIcon';
import { GithubIcon } from '../../icons/GithubIcon';
import { TwitterIcon } from '../../icons/TwitterIcon';
import { YoutubeIcon } from '../../icons/YoutubeIcons';
import { Tooltip } from './tooltip';
import api from '../../config/axios.config';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

interface CardProps {
    id: string;
    title: string;
    source: 'youtube' | 'facebook' | 'twitter' | 'github';
    link: string;
    summary?: string;
    deleteOption?: boolean;
    setDeleteModalOpen?: (open: boolean) => void;
    setContentId?: (id: string) => void;
}

interface GithubRepo {
    name: string;
    description: string;
    stargazers_count: number;
    forks_count: number;
    owner: {
        login: string;
        avatar_url: string;
    };
    html_url: string;
    language: string;
    updated_at: string;
}

export const Card = ({
    id,
    title,
    source,
    link,
    deleteOption,
    setDeleteModalOpen,
    setContentId,
}: CardProps) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const cardRef = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(true);
    const [repoData, setRepoData] = useState<GithubRepo | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    const processFacebookUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;
            if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
                const encodedUrl = encodeURIComponent(url);
                return `https://www.facebook.com/plugins/post.php?href=${encodedUrl}&show_text=true&width=500`;
            }
            return url;
        } catch (e) {
            return url;
        }
    };

    const parseGithubUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const parts = pathname.split('/').filter(Boolean);
            if (parts.length >= 2) {
                return { owner: parts[0], repo: parts[1] };
            }
            return null;
        } catch (e) {
            return null;
        }
    };

    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
        if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
        return `${Math.floor(diffInSeconds / 86400)}d ago`;
    };

    // Disable pointer-events when card is obscured by mobile bottom nav
    useEffect(() => {
        const el = cardRef.current;
        if (!el) return;

        const isMobile = window.innerWidth < 640; // matches sm breakpoint
        if (!isMobile) {
            setIsVisible(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => setIsVisible(entry.isIntersecting),
            { threshold: 0.95, rootMargin: '0px 0px -64px 0px' }
        );
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (source === 'twitter') {
            const script = document.createElement('script');
            script.src = 'https://platform.twitter.com/widgets.js';
            script.async = true;
            document.body.appendChild(script);
            return () => {
                document.body.removeChild(script);
            };
        }
        if (source === 'github' && link) {
            const fetchRepoData = async () => {
                const repoInfo = parseGithubUrl(link);
                if (!repoInfo) return;
                setLoading(true);
                try {
                    const response = await fetch(
                        `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`
                    );
                    if (!response.ok) throw new Error('Repo not found');
                    const data = await response.json();
                    setRepoData(data);
                } catch (err) {
                    setError('Failed to load GitHub data');
                } finally {
                    setLoading(false);
                }
            };
            fetchRepoData();
        }
    }, [source, link]);

    const deleteModal = (id: string) => {
        setDeleteModalOpen?.(true);
        setContentId?.(id);
    };

    const handleDelete = async () => {
        const body = { contentId: id };
        try {
            const response = await api.delete(`/content/delete-content`, { data: body });
            if (response.status === 200) {
                toast.success('Deleted');
                await queryClient.invalidateQueries({ queryKey: ['allContent'] });
                setShowDeleteConfirm(false);
            }
        } catch (err) {
            toast.error('Failed to delete');
        }
    };

    const getYoutubeEmbedUrl = (url: string) => {
        try {
            if (!url) return null;
            const parsedUrl = new URL(url);
            let videoId = '';
            if (parsedUrl.hostname.includes('youtube.com')) {
                videoId = parsedUrl.searchParams.get('v') || '';
            } else if (parsedUrl.hostname.includes('youtu.be')) {
                videoId = parsedUrl.pathname.slice(1);
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
        } catch (error) {
            return null;
        }
    };

    const SourceIcon = () => {
        switch (source) {
            case 'facebook': return <FacebookIcon />;
            case 'youtube': return <YoutubeIcon />;
            case 'twitter': return <TwitterIcon />;
            case 'github': return <GithubIcon />;
            default: return null;
        }
    };

    return (
        <motion.div
            ref={cardRef}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            whileHover={{ y: -5 }}
            className="group relative flex flex-col bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all duration-300 w-full max-w-64 h-[320px] z-10"
            style={{ pointerEvents: isVisible ? 'auto' : 'none' }}
        >
            {/* Delete Confirmation Overlay */}
            <AnimatePresence>
                {showDeleteConfirm && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="absolute inset-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center rounded-3xl"
                    >
                        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-2xl mb-3 text-red-500">
                            <DeleteIcon />
                        </div>
                        <h4 className="text-sm font-black text-slate-900 dark:text-white mb-1">Delete Memory?</h4>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400 mb-4 font-medium leading-relaxed">This action cannot be undone.</p>
                        <div className="flex items-center gap-2 w-full">
                            <button 
                                onClick={() => setShowDeleteConfirm(false)}
                                className="flex-1 py-2 text-[10px] font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition-colors cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={handleDelete}
                                className="flex-1 py-2 text-[10px] font-bold bg-red-500 text-white hover:bg-red-600 rounded-xl shadow-lg shadow-red-500/30 transition-all cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Header */}
            <div className="flex items-center justify-between p-3 border-b border-slate-50 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 rounded-t-3xl overflow-visible">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <div className="p-1.5 bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 flex-shrink-0">
                        <SourceIcon />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-0.5">{source}</span>
                        <h3 className="text-[11px] font-black text-slate-900 dark:text-white truncate">
                            {title}
                        </h3>
                    </div>
                    <div className="flex items-center gap-1 cursor-pointer">
                        {/* will be individual share in future after implementing ai agent */}
                        {/* <span className="hover:bg-slate-300 p-1 rounded-full transition-all duration-300"> */}
                        {/* <ShareIcon />
                        </span> */}
                        <Tooltip text="Summary">
                            <span
                                className="hover:bg-slate-300 p-1 rounded-full transition-all duration-300"
                                onClick={() => navigate(`/summary/${id}`)}
                            >
                                <SummaryIcon />
                            </span>
                        </Tooltip>
                        {deleteOption && (
                            <Tooltip text="Delete">
                                <span
                                    className="hover:bg-slate-300 p-1 rounded-full transition-all duration-300"
                                    onClick={() => deleteModal(id)}
                                >
                                    <DeleteIcon />
                                </span>
                            </Tooltip>
                        )}
                    </div>
                </div>
                <div className="font-bold w-32">
                    <h3 className="truncate">{title}</h3>
                </div>

            {/* Content Body */}
            <div className="flex-1 overflow-hidden relative rounded-b-3xl">
                {source === 'youtube' && (
                    <iframe
                        className="w-full h-full"
                        src={getYoutubeEmbedUrl(link) || ''}
                        title={title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    />
                )}

                {source === 'twitter' && (
                    <div className="w-full h-full overflow-y-auto p-4 scrollbar-hide">
                        <blockquote className="twitter-tweet">
                            <a href={link.replace('x', 'twitter')}></a>
                        </blockquote>
                    </div>
                )}

                {source === 'facebook' && (
                    <iframe
                        src={processFacebookUrl(link)}
                        className="w-full h-full"
                        style={{ border: 'none' }}
                        allowFullScreen
                        allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                    />
                )}

                {source === 'github' && (
                    <div className="p-4 h-full flex flex-col bg-slate-50 dark:bg-slate-950/50">
                        {loading ? (
                            <div className="flex items-center justify-center h-full animate-pulse space-x-2">
                                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                                <div className="w-2 h-2 bg-slate-400 rounded-full"></div>
                            </div>
                        ) : error ? (
                            <div className="flex items-center justify-center h-full text-slate-400 text-xs italic">
                                {error}
                            </div>
                        ) : repoData && (
                            <div className="flex flex-col h-full gap-3">
                                <div className="flex items-center gap-3">
                                    <img src={repoData.owner.avatar_url} className="w-10 h-10 rounded-xl shadow-sm" alt="" />
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="text-xs text-slate-500 truncate">{repoData.owner.login}</span>
                                        <a href={repoData.html_url} target="_blank" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline truncate">
                                            {repoData.name}
                                        </a>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3 leading-relaxed italic">
                                    {repoData.description || 'No description available'}
                                </p>
                                <div className="mt-auto flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
                                    <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                                        <span className="flex items-center gap-1">⭐ {repoData.stargazers_count}</span>
                                        <span className="flex items-center gap-1">🍴 {repoData.forks_count}</span>
                                    </div>
                                    <span className="text-[10px] text-slate-400 italic">
                                        {formatRelativeTime(repoData.updated_at)}
                                    </span>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Bottom bar */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/50 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 underline flex items-center gap-1"
                >
                    Visit Source
                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                </a>
            </div>
        </motion.div>
    );
};
