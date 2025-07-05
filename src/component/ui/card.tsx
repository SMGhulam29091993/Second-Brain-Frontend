import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../config/axios.config';
import { DeleteIcon } from '../../icons/DeleteIcons';
import { SummaryIcon } from '../../icons/SummaryIcon';

import { FacebookIcon } from '../../icons/FacebookIcon';
import { GithubIcon } from '../../icons/GithubIcon';
import { TwitterIcon } from '../../icons/TwitterIcon';
import { YoutubeIcon } from '../../icons/YoutubeIcons';
import toast from 'react-hot-toast';
import { Tooltip } from './tooltip';
interface CardProps {
    id: string;
    title: string;
    source: 'youtube' | 'facebook' | 'twitter' | 'github';
    link: string;
    summary?: string;
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

export const Card = ({ id, title, source, link, summary }: CardProps) => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [repoData, setRepoData] = useState<GithubRepo | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    // Process Facebook URL to create embed URL
    const processFacebookUrl = (url: string) => {
        try {
            // Create a URL object
            const urlObj = new URL(url);
            const hostname = urlObj.hostname;

            // Check if it's a Facebook URL
            if (hostname.includes('facebook.com') || hostname.includes('fb.com')) {
                // Encode the entire URL for the embed
                const encodedUrl = encodeURIComponent(url);
                return `https://www.facebook.com/plugins/post.php?href=${encodedUrl}&show_text=true&width=500`;
            }
            return url;
        } catch (e) {
            console.error('Invalid URL:', e);
            return url;
        }
    };

    // Parse GitHub URL to get owner and repo
    const parseGithubUrl = (url: string) => {
        try {
            const urlObj = new URL(url);
            const pathname = urlObj.pathname;
            const parts = pathname.split('/').filter(Boolean);

            if (parts.length >= 2) {
                return {
                    owner: parts[0],
                    repo: parts[1],
                };
            }
            return null;
        } catch (e) {
            console.error('Invalid GitHub URL:', e);
            return null;
        }
    };

    // Format date to relative time (e.g., "2 days ago")
    const formatRelativeTime = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

        if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
        if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
        if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
        if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)} days ago`;
        if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)} months ago`;
        return `${Math.floor(diffInSeconds / 31536000)} years ago`;
    };

    useEffect(() => {
        //to dynamically load the Twitter widget script
        if (source === 'twitter') {
            const script = document.createElement('script');
            script.src = 'https://platform.twitter.com/widgets.js';
            script.async = true;
            document.body.appendChild(script);

            return () => {
                document.body.removeChild(script);
            };
        }
        //to dynamically load the GitHub widget script
        if (source === 'github' && link) {
            // Fetch repository data
            const fetchRepoData = async () => {
                const repoInfo = parseGithubUrl(link);
                if (!repoInfo) {
                    setError('Invalid GitHub URL');
                    return;
                }

                setLoading(true);
                try {
                    const response = await fetch(
                        `https://api.github.com/repos/${repoInfo.owner}/${repoInfo.repo}`
                    );
                    if (!response.ok) {
                        throw new Error('Repository not found');
                    }
                    const data = await response.json();
                    setRepoData(data);
                } catch (err) {
                    setError((err as Error).message || 'Failed to fetch repository data');
                } finally {
                    setLoading(false);
                }
            };

            fetchRepoData();
        }
    }, [source, link]);

    const handleDelete = async () => {
        let body = {
            contentId: id,
        };
        const deleteContent = await api.delete(`/content/delete-content`, { data: body });
        if (deleteContent.status === 200) {
            // Optionally, you can add a success message or refresh the content list
            toast.success('Content deleted successfully!');

            await queryClient.invalidateQueries({
                queryKey: ['allContent'],
            });
        } else {
            toast.error('Failed to delete content. Please try again.');
            console.error('Failed to delete content:', deleteContent);
        }
        return;
    };

    return (
        <>
            <div className="p-3 flex flex-col justify-center bg-slate-200 rounded-md border-amber-400 shadow-2xl max-w-64 min-h-52">
                <div className="flex items-center justify-between gap-2">
                    <div className="cursor-text font-semibold w-28">
                        <h4 className="truncate">
                            {source === 'facebook' ? (
                                <span className="flex items-center flex-wrap gap-1">
                                    <FacebookIcon />
                                    Facebook
                                </span>
                            ) : source === 'youtube' ? (
                                <span className="flex items-center flex-wrap gap-1">
                                    <YoutubeIcon />
                                    Youtube
                                </span>
                            ) : source === 'twitter' ? (
                                <span className="flex items-center flex-wrap gap-1">
                                    <TwitterIcon />
                                    Twitter
                                </span>
                            ) : (
                                <span className="flex items-center flex-wrap gap-1">
                                    <GithubIcon />
                                    Github
                                </span>
                            )}
                        </h4>
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
                        <Tooltip text="Delete">
                            <span
                                className="hover:bg-slate-300 p-1 rounded-full transition-all duration-300"
                                onClick={handleDelete}
                            >
                                <DeleteIcon />
                            </span>
                        </Tooltip>
                    </div>
                </div>
                <div className="font-bold w-32">
                    <h3 className="truncate">{title}</h3>
                </div>

                <div className="mt-2 hover:scale-102 transition-all duration-300 cursor-pointer">
                    {source === 'youtube' && (
                        <iframe
                            className="w-full h-48"
                            src={link.replace('watch', 'embed').replace('?v=', '/')}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    )}
                    {source === 'twitter' && (
                        <div className="w-full h-48 overflow-hidden p-2">
                            <blockquote className="twitter-tweet">
                                <a href={link.replace('x', 'twitter')}></a>
                            </blockquote>
                        </div>
                    )}
                    {source === 'facebook' && (
                        <iframe
                            src={processFacebookUrl(link)}
                            className="w-full h-48"
                            style={{ border: 'none', overflow: 'auto' }}
                            scrolling="no"
                            frameBorder="0"
                            allowFullScreen={true}
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        ></iframe>
                    )}
                    {source === 'github' && (
                        <div className="flex flex-col gap-1 p-2 bg-white rounded-md w-full h-48 overflow-y-auto ">
                            {loading && (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-xs">Loading repository data...</div>
                                </div>
                            )}

                            {error && (
                                <div className="flex items-center justify-center h-full">
                                    <div className="text-xs text-red-500">{error}</div>
                                </div>
                            )}

                            {repoData && (
                                <div className="flex flex-col h-full">
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={repoData.owner.avatar_url}
                                            alt={repoData.owner.login}
                                            className="w-6 h-6 rounded-full"
                                        />
                                        <div>
                                            <div className="flex items-center">
                                                <a
                                                    href={`https://github.com/${repoData.owner.login}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline text-xs font-medium"
                                                >
                                                    {repoData.owner.login}
                                                </a>
                                                <span className="text-gray-500 mx-1">/</span>
                                                <a
                                                    href={repoData.html_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline text-xs font-bold"
                                                >
                                                    {repoData.name}
                                                </a>
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                Updated {formatRelativeTime(repoData.updated_at)}
                                            </div>
                                        </div>
                                    </div>

                                    {repoData.description && (
                                        <p className="text-xs text-gray-700 mt-1 mb-1 line-clamp-2">
                                            {repoData.description}
                                        </p>
                                    )}

                                    <div className="flex items-center gap-2 mt-1">
                                        {repoData.language && (
                                            <div className="flex items-center gap-1">
                                                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                                <span className="text-xs text-gray-600">
                                                    {repoData.language}
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center gap-1">
                                            <svg
                                                aria-hidden="true"
                                                height="14"
                                                viewBox="0 0 16 16"
                                                version="1.1"
                                                width="14"
                                                className="fill-gray-600"
                                            >
                                                <path d="M8 .25a.75.75 0 0 1 .673.418l1.882 3.815 4.21.612a.75.75 0 0 1 .416 1.279l-3.046 2.97.719 4.192a.751.751 0 0 1-1.088.791L8 12.347l-3.766 1.98a.75.75 0 0 1-1.088-.79l.72-4.194L.818 6.374a.75.75 0 0 1 .416-1.28l4.21-.611L7.327.668A.75.75 0 0 1 8 .25Z"></path>
                                            </svg>
                                            <span className="text-xs text-gray-600">
                                                {repoData.stargazers_count}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-1">
                                            <svg
                                                aria-hidden="true"
                                                height="14"
                                                viewBox="0 0 16 16"
                                                version="1.1"
                                                width="14"
                                                className="fill-gray-600"
                                            >
                                                <path d="M5 5.372v.878c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75v-.878a2.25 2.25 0 1 1 1.5 0v.878a2.25 2.25 0 0 1-2.25 2.25h-1.5v2.128a2.251 2.251 0 1 1-1.5 0V8.5h-1.5A2.25 2.25 0 0 1 3.5 6.25v-.878a2.25 2.25 0 1 1 1.5 0ZM5 3.25a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Zm6.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm-3 8.75a.75.75 0 1 0-1.5 0 .75.75 0 0 0 1.5 0Z"></path>
                                            </svg>
                                            <span className="text-xs text-gray-600">
                                                {repoData.forks_count}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center mt-2">
                                        <div className="scale-75 origin-left">
                                            <a
                                                className="github-button z-10"
                                                href={`https://github.com/${repoData.owner.login}/${repoData.name}`}
                                                data-icon="octicon-star"
                                                data-size="small"
                                                data-show-count="true"
                                                aria-label={`Star ${repoData.owner.login}/${repoData.name} on GitHub`}
                                            >
                                                Star
                                            </a>
                                        </div>

                                        <a
                                            href={repoData.html_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-2xs bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-1 px-2 rounded border border-gray-300 transition-colors"
                                        >
                                            View on GitHub
                                        </a>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};
