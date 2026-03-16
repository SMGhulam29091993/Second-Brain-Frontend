/* eslint-disable react-refresh/only-export-components */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import api from '../../config/axios.config';
import { SubmitIcon } from '../../icons/SubmitIcon';
import { Button } from '../ui/button';
import { Modal } from '../ui/modal';
import toast from 'react-hot-toast';

interface AddContentModalProps {
    open: boolean;
    onClose: () => void;
}

export enum ContentType {
    VIDEO = 'video',
    IMAGE = 'image',
    AUDIO = 'audio',
    Article = 'article',
    NONE = 'none',
    REPOSITORY = 'repository',
}

export enum ContentSource {
    NONE = 'none',
    YOUTUBE = 'youtube',
    TWITTER = 'twitter',
    FACEBOOK = 'facebook',
    GITHUB = 'github',
}

export const AddContentModal: React.FC<AddContentModalProps> = ({ open, onClose }) => {
    const queryClient = useQueryClient();
    const [contentData, setContentData] = useState<any>({});
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [validationError, setValidationError] = useState<string>('');

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setContentData((prev) => ({ ...prev, [id]: value }));

        // Clear validation error when user makes changes
        if (validationError) {
            setValidationError('');
        }
    };

    const validateForm = (): boolean => {
        const data = contentData as any;
        const { type, source, link } = data;

        // Check if all fields are filled
        if (!type || type === ContentType.NONE) {
            setValidationError('Please select a content type');
            return false;
        }

        if (!source || source === ContentSource.NONE) {
            setValidationError('Please select a source');
            return false;
        }

        if (!link || link.trim() === '') {
            setValidationError('Please provide a valid link');
            return false;
        }

        const url = link.toLowerCase();

        // YouTube validation
        if (source === ContentSource.YOUTUBE) {
            if (type !== ContentType.VIDEO) {
                setValidationError('YouTube source requires Video content type');
                return false;
            }
            if (!url.includes('youtu.be') && !url.includes('youtube.com')) {
                setValidationError('Please provide a valid YouTube URL (youtube.com or youtu.be)');
                return false;
            }
        }

        // Video type validation
        if (type === ContentType.VIDEO) {
            if (source !== ContentSource.YOUTUBE) {
                setValidationError('Video content type requires YouTube source');
                return false;
            }
            if (!url.includes('youtu.be') && !url.includes('youtube.com')) {
                setValidationError('Please provide a valid YouTube URL (youtube.com or youtu.be)');
                return false;
            }
        }

        // GitHub validation
        if (source === ContentSource.GITHUB) {
            if (type !== ContentType.REPOSITORY) {
                setValidationError('GitHub source requires Repository content type');
                return false;
            }
            if (!url.includes('github.com')) {
                setValidationError('Please provide a valid GitHub URL (github.com)');
                return false;
            }
        }

        // Repository type validation
        if (type === ContentType.REPOSITORY) {
            if (source !== ContentSource.GITHUB) {
                setValidationError('Repository content type requires GitHub source');
                return false;
            }
            if (!url.includes('github.com')) {
                setValidationError('Please provide a valid GitHub URL (github.com)');
                return false;
            }
        }

        // Twitter validation
        if (source === ContentSource.TWITTER) {
            if (!url.includes('twitter.com/') && !url.includes('x.com/')) {
                setValidationError('Please provide a valid Twitter/X URL (twitter.com)');
                return false;
            }
        }

        // Facebook validation
        if (source === ContentSource.FACEBOOK) {
            if (!url.includes('facebook.com')) {
                setValidationError('Please provide a valid Facebook URL (facebook.com)');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        // Validate form before submitting
        if (!validateForm()) {
            toast.error(validationError);
            return;
        }

        setIsLoading(true);
        try {
            const res = await api.post('/content/add-content', contentData);

            if (res.status === 200 || res.status === 201) {
                toast.success('Content added successfully!');
                setTimeout(() => {
                    setIsLoading(false);
                    setContentData({});
                    setValidationError('');
                    queryClient.invalidateQueries({ queryKey: ['allContent'] });
                    onClose();
                }, 1000);
            } else {
                toast.error('Failed to add content. Please try again.');
                setIsLoading(false);
            }
            return res.data.data;
        } catch (error) {
            toast.error('Failed to add content. Please try again.');
            setIsLoading(false);
        }
    };

    return (
        <>
            {open && (
                <div className="fixed w-screen h-screen top-0 left-0 flex justify-center z-[9999]">
                    {/* Background Overlay */}
                    <div className="absolute w-full h-full bg-black opacity-85"></div>

                    <div className="relative flex flex-col justify-center max-w-lg mx-auto">
                        <span className="bg-white p-4 rounded-md shadow-lg">
                            <div className="flex justify-end mb-2">
                                <div className="cursor-pointer" onClick={onClose}>
                                    <CloseIcon />
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center border border-slate-300 rounded-md p-4">
                                <input
                                    id="title"
                                    type="text"
                                    placeholder="Add Title"
                                    className="outline-0 border border-slate-400 m-2 p-2 rounded-md w-full placeholder:text-black"
                                    onChange={onChangeHandler}
                                />
                                <span className="flex items-center justify-between gap-4">
                                    <select
                                        id="type"
                                        className="border border-slate-400 rounded-md p-2"
                                        onChange={onChangeHandler}
                                    >
                                        <option value={ContentType.NONE}>Select Type</option>
                                        <option value={ContentType.VIDEO}>Video</option>
                                        <option value={ContentType.IMAGE}>Image</option>
                                        <option value={ContentType.AUDIO}>Audio</option>
                                        <option value={ContentType.Article}>Article</option>
                                        <option value={ContentType.REPOSITORY}>Repository</option>
                                    </select>
                                    <select
                                        id="source"
                                        className="border border-slate-400 rounded-md p-2"
                                        onChange={onChangeHandler}
                                    >
                                        <option value={ContentSource.NONE}>Select Source</option>
                                        <option value={ContentSource.YOUTUBE}>Youtube</option>
                                        <option value={ContentSource.TWITTER}>Twitter</option>
                                        <option value={ContentSource.FACEBOOK}>Facebook</option>
                                        <option value={ContentSource.GITHUB}>Github</option>
                                    </select>
                                </span>
                                <input
                                    id="link"
                                    type="text"
                                    placeholder="Add Link"
                                    className="outline-0 border border-slate-400 m-2 p-2 rounded-md w-full placeholder:text-black"
                                    onChange={onChangeHandler}
                                />
                                {validationError && (
                                    <div className="text-red-500 text-sm mt-2 w-full text-center">
                                        {validationError}
                                    </div>
                                )}
                            </div>
                            <div className="flex justify-end mt-2 py-2">
                                <Button
                                    variants="primary"
                                    text="Submit"
                                    size="md"
                                    startIcon={<SubmitIcon />}
                                    onClick={handleSubmit}
                                    loading={isLoading}
                                    fullWidth={true}
                                />
                            </div>
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};
