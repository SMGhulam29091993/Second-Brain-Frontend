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
import { ShareModal } from '../component/sharedComponents/shareModal.component';

const SummaryPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [isCreatingShareLink, setIsCreatingShareLink] = useState<boolean>(false);
    const [shareOpen, setShareOpen] = useState<boolean>(false);
    const [shareLink, setShareLink] = useState<string>('');

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
                const link = `${resp.data.data.link}`;
                setShareLink(link);
                setShareOpen(true);
                toast.success('Share link generated!');
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error: any) {
            console.error('Error creating share link:', error);
            toast.error('Failed to create share link.');
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
            <ShareModal open={shareOpen} onClose={() => setShareOpen(false)} shareLink={shareLink} />
            <div className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {content.title}
                    </h1>
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                        <Button
                            variants="secondary"
                            text="Back"
                            size="md"
                            startIcon={<PreviousIcon />}
                            onClick={() => navigate('/dashboard')}
                            className="w-full sm:w-auto"
                        />
                        <Button
                            variants="secondary"
                            text={isCreatingShareLink ? 'Creating...' : 'Share'}
                            startIcon={<ShareIcon />}
                            size="md"
                            onClick={createShareLink}
                            className="w-full sm:w-auto"
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
