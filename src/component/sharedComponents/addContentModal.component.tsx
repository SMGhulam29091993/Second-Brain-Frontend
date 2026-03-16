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
        setContentData((prev: any) => ({ ...prev, [id]: value }));
        if (validationError) setValidationError('');
    };

    const validateForm = (): boolean => {
        const { type, source, link, title } = contentData;

        if (!title || title.trim() === '') {
            setValidationError('Please provide a title');
            return false;
        }

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
                setValidationError('Please provide a valid YouTube URL');
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
                setValidationError('Please provide a valid GitHub URL');
                return false;
            }
        }

        return true;
    };

    const handleSubmit = async () => {
        if (!validateForm()) {
            toast.error(validationError);
            return;
        }

        setIsLoading(true);
        try {
            const res = await api.post('/content/add-content', contentData);
            if (res.status === 200 || res.status === 201) {
                toast.success('Memory captured successfully!');
                queryClient.invalidateQueries({ queryKey: ['allContent'] });
                setContentData({});
                onClose();
            }
        } catch (err) {
            toast.error('Failed to add content');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Capture New Memory">
            <div className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Title</label>
                    <input
                        id="title"
                        type="text"
                        placeholder="What's this about?"
                        value={contentData.title || ''}
                        className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-3 text-slate-900 dark:text-white outline-none transition-all font-medium"
                        onChange={onChangeHandler}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Type</label>
                        <select
                            id="type"
                            className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl px-4 py-3 text-slate-900 dark:text-white outline-none transition-all font-bold cursor-pointer appearance-none"
                            onChange={onChangeHandler}
                            value={contentData.type || ContentType.NONE}
                        >
                            <option value={ContentType.NONE}>Select Type</option>
                            <option value={ContentType.VIDEO}>Video</option>
                            <option value={ContentType.IMAGE}>Image</option>
                            <option value={ContentType.AUDIO}>Audio</option>
                            <option value={ContentType.Article}>Article</option>
                            <option value={ContentType.REPOSITORY}>Repository</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Source</label>
                        <select
                            id="source"
                            className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl px-4 py-3 text-slate-900 dark:text-white outline-none transition-all font-bold cursor-pointer appearance-none"
                            onChange={onChangeHandler}
                            value={contentData.source || ContentSource.NONE}
                        >
                            <option value={ContentSource.NONE}>Select Source</option>
                            <option value={ContentSource.YOUTUBE}>Youtube</option>
                            <option value={ContentSource.TWITTER}>Twitter</option>
                            <option value={ContentSource.FACEBOOK}>Facebook</option>
                            <option value={ContentSource.GITHUB}>Github</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Link / URL</label>
                    <input
                        id="link"
                        type="text"
                        placeholder="https://..."
                        value={contentData.link || ''}
                        className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-3 text-slate-900 dark:text-white outline-none transition-all font-medium"
                        onChange={onChangeHandler}
                    />
                </div>

                {validationError && (
                    <div className="bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 p-3 rounded-xl text-xs font-bold text-center">
                        {validationError}
                    </div>
                )}

                <div className="pt-4">
                    <Button
                        variants="primary"
                        text="Capture Memory"
                        size="lg"
                        startIcon={<SubmitIcon />}
                        onClick={handleSubmit}
                        loading={isLoading}
                        fullWidth={true}
                    />
                </div>
            </div>
        </Modal>
    );
};
