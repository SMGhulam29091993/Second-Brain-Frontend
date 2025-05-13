import React from 'react';
import { CloseIcon } from '../../icons/CloseIcon';
import { Button } from '../ui/button';

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
}

export enum ContentSource {
    NONE = 'none',
    YOUTUBE = 'youtube',
    TWITTER = 'twitter',
    FACEBOOK = 'facebook',
    GITHUB = 'github',
}

export const AddContentModal: React.FC<AddContentModalProps> = ({ open, onClose }) => {
    return (
        <>
            {open && (
                <div className="fixed w-screen h-screen top-0 left-0 flex justify-center">
                    {/* Background Overlay */}
                    <div className="absolute w-full h-full bg-black opacity-85 z-10"></div>

                    <div className="relative flex flex-col justify-center max-w-lg mx-auto z-20">
                        <span className="bg-white p-4 rounded-md shadow-lg">
                            <div className="flex justify-end mb-2">
                                <div className="cursor-pointer" onClick={onClose}>
                                    <CloseIcon />
                                </div>
                            </div>
                            <div className="flex flex-col items-center justify-center border border-slate-300 rounded-md p-4">
                                <input
                                    type="text"
                                    placeholder="Add Title"
                                    className="outline-0 border border-slate-400 m-2 p-2 rounded-md w-full placeholder:text-black"
                                />
                                <span className="flex items-center justify-between gap-4">
                                    <select className="border border-slate-400 rounded-md p-2">
                                        <option value={ContentType.NONE}>Select Type</option>
                                        <option value={ContentType.VIDEO}>Video</option>
                                        <option value={ContentType.IMAGE}>Image</option>
                                        <option value={ContentType.AUDIO}>Audio</option>
                                        <option value={ContentType.Article}>Article</option>
                                    </select>
                                    <select className="border border-slate-400 rounded-md p-2">
                                        <option value={ContentSource.NONE}>Select Source</option>
                                        <option value={ContentSource.YOUTUBE}>Youtube</option>
                                        <option value={ContentSource.TWITTER}>Twitter</option>
                                        <option value={ContentSource.FACEBOOK}>Facebook</option>
                                        <option value={ContentSource.GITHUB}>Github</option>
                                    </select>
                                </span>
                                <input
                                    type="text"
                                    placeholder="Add Link"
                                    className="outline-0 border border-slate-400 m-2 p-2 rounded-md w-full placeholder:text-black"
                                />
                            </div>
                            <div className="flex justify-end mt-2 py-2">
                                <Button
                                    variants="primary"
                                    text="Submit"
                                    size="md"
                                    onClick={() => console.log('Add Content')}
                                />
                            </div>
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};
