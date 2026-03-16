import React from 'react';
import { Modal } from '../ui/modal';
import { Button } from '../ui/button';
import { ShareIcon } from '../../icons/ShareIcons';
import toast from 'react-hot-toast';

interface ShareModalProps {
    open: boolean;
    onClose: () => void;
    shareLink: string;
}

export const ShareModal: React.FC<ShareModalProps> = ({ open, onClose, shareLink }) => {
    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(shareLink);
            toast.success('Link copied to clipboard!');
        } catch (err) {
            toast.error('Failed to copy link');
        }
    };

    return (
        <Modal open={open} onClose={onClose} title="Share Your Brain">
            <div className="space-y-6 text-center">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-[2rem] border border-blue-100 dark:border-blue-800">
                    <div className="flex justify-center mb-4 text-blue-600 dark:text-blue-400">
                        <ShareIcon />
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        Anyone with this link can view your curated collection of memories and insights.
                    </p>
                </div>

                <div className="relative group">
                    <input
                        readOnly
                        value={shareLink}
                        className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-transparent focus:border-blue-500 rounded-2xl px-5 py-4 text-sm font-bold text-slate-900 dark:text-white outline-none transition-all pr-24"
                    />
                    <button
                        onClick={handleCopy}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-blue-700 transition-all cursor-pointer shadow-lg shadow-blue-500/30"
                    >
                        Copy
                    </button>
                </div>

                <div className="pt-2">
                    <Button
                        variants="secondary"
                        text="Close"
                        size="md"
                        onClick={onClose}
                        fullWidth={true}
                    />
                </div>
            </div>
        </Modal>
    );
};
