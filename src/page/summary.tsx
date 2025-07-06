import { useQuery } from '@tanstack/react-query';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate, useParams } from 'react-router-dom';
import { AppLayout } from '../component/ui/appLayout';
import { Button } from '../component/ui/button';
import api from '../config/axios.config';
import { EyeIcon } from '../icons/EyeIcon';
import { PreviousIcon } from '../icons/PreviousIcon';
import { ShareIcon } from '../icons/ShareIcons';

const SummaryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isCreatingShareLink, setIsCreatingShareLink] = useState<boolean>(false);

    const fetchContent = async () => {
        const response = await api.get(`/content/summary/${id}`);
        return response.data.data;
    };

    const {
        data: content,
        isLoading,
        isError,
    } = useQuery({
        queryKey: ['content', id],
        queryFn: fetchContent,
    });

    const createShareLink = async () => {
        if (!id) return;
        setIsCreatingShareLink(true);
        try {
            const resp = await api.post(`/link/summary-link/${id}`);
            if (resp.data && resp.data.data && resp.data.data.link) {
                console.log(resp.data.data.link);

                const shareLink = `${resp.data.data.link}`;
                toast.success('Share link created successfully!');
                await navigator.clipboard.writeText(shareLink);
                alert('Share link copied to clipboard! : ' + shareLink);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error: any) {
            console.error('Error creating share link:', error);
            let errorMessage = 'Failed to create share link. ';
            if (error.response) {
                switch (error.response.status) {
                    case 500:
                        errorMessage += 'Server error. Please try again later.';
                        break;
                    case 401:
                        errorMessage += 'Please log in again.';
                        break;
                    case 403:
                        errorMessage += "You don't have permission to create share links.";
                        break;
                    default:
                        errorMessage += `Server error (${error.response.status}).`;
                }
            } else if (error.request) {
                errorMessage += 'Network error. Please check your connection.';
            } else {
                errorMessage += error.message || 'Unknown error occurred.';
            }
            toast.error(errorMessage);
        } finally {
            setIsCreatingShareLink(false);
        }
    };

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
                Loading...
            </div>
        );
    }

    if (isError || !content) {
        return (
            <div className="dark:text-white text-black">
                Error loading content or content not found.
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
                            text="Back"
                            size="md"
                            startIcon={<PreviousIcon />}
                            onClick={() => navigate('/dashboard')}
                        />
                        <Button
                            variants="secondary"
                            text={isCreatingShareLink ? 'Creating...' : 'Share'}
                            startIcon={<ShareIcon />}
                            size="md"
                            onClick={createShareLink}
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

export default AppLayout(SummaryPage);
