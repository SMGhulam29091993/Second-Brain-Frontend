import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import api from '../config/axios.config';
import { AppLayout } from '../component/ui/appLayout';
import { Button } from '../component/ui/button';

import { ShareIcon } from '../icons/ShareIcons';
import toast from 'react-hot-toast';
import { EyeIcon } from '../icons/EyeIcon';
import { SubmitIcon } from '../icons/SubmitIcon';

const SharedSummaryPage: React.FC = () => {
    const { hash } = useParams<{ hash: string }>();
    const navigate = useNavigate();
    const [isCreatingShareLink, setIsCreatingShareLink] = useState<boolean>(false);

    const createShareLink = async () => {
        setIsCreatingShareLink(true);
        try {
            const shareLink = window.location.href;
            toast.success('Share link copied to clipboard!');
            await navigator.clipboard.writeText(shareLink);
            alert('Share link copied to clipboard! : ' + shareLink);
        } catch (error) {
            console.error('Error copying share link:', error);
            toast.error('Failed to copy share link.');
        } finally {
            setIsCreatingShareLink(false);
        }
    };

    const fetchSharedContent = async () => {
        const response = await api.get(`/link/summary/${hash}`);
        return response.data.data;
    };

    const {
        data: content,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['sharedContent', hash],
        queryFn: fetchSharedContent,
        enabled: !!hash, // Only run query if hash exists
    });

    const getYouTubeVideoId = (url: string) => {
        let videoId = null;
        const youtubeRegex =
            /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/ ]{11})/i;
        const match = url.match(youtubeRegex);
        if (match && match[1]) {
            videoId = match[1];
        }
        return videoId;
    };

    if (isLoading) {
        return (
            <div className="dark:text-white text-black flex flex-col items-center text-lg font-bold">
                Loading shared summary...
            </div>
        );
    }

    if (isError || !content) {
        return (
            <div className="dark:text-white text-black">
                Error loading shared content or content not found.
            </div>
        );
    }

    const videoId = content.source === 'youtube' ? getYouTubeVideoId(content.link) : null;

    return (
        <div className="container mx-auto p-4">
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {content.title}
                    </h1>
                    <div className="flex gap-2">
                        <Button
                            variants="secondary"
                            text="Sign Up"
                            size="md"
                            startIcon={<SubmitIcon />}
                            onClick={() => navigate('/signup')}
                        />
                        <Button
                            variants="secondary"
                            text="Share"
                            size="md"
                            onClick={createShareLink}
                            loading={isCreatingShareLink}
                            startIcon={<ShareIcon />}
                        />
                    </div>
                </div>

                {videoId && (
                    <div className="mb-4">
                        <iframe
                            width="100%"
                            height="315"
                            src={`https://www.youtube.com/embed/${videoId}`}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                        ></iframe>
                    </div>
                )}

                {content.source === 'twitter' && (
                    <div className="mb-4">
                        <Button
                            variants="primary"
                            size="md"
                            onClick={() => window.open(content.link, '_blank')}
                            text="View on Twitter"
                            startIcon={<EyeIcon />}
                        />
                    </div>
                )}

                {content.source === 'github' && (
                    <div className="mb-4">
                        <Button
                            variants="primary"
                            size="md"
                            onClick={() => window.open(content.link, '_blank')}
                            text="View on GitHub"
                            startIcon={<EyeIcon />}
                        />
                    </div>
                )}

                <div>
                    <h2 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-200">
                        Summary
                    </h2>
                    <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                        {content.summary || 'No summary available.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AppLayout(SharedSummaryPage);
