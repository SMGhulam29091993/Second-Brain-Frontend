import toast from 'react-hot-toast';
import { CloseIcon } from '../../icons/CloseIcon';
import { DeleteIcon } from '../../icons/DeleteIcons';
import { Button } from '../ui/button';
import { useQueryClient } from '@tanstack/react-query';
import api from '../../config/axios.config';
import { useState } from 'react';

interface DeleteContentModalProps {
    open: boolean;
    onClose: () => void;
    contentId: string;
}

export const DeleteContentModal: React.FC<DeleteContentModalProps> = ({
    open,
    onClose,
    contentId,
}) => {
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onDelete = async () => {
        setIsLoading(true);
        console.log('Deleting content with ID:', contentId);

        const body = {
            contentId,
        };
        const deleteContent = await api.delete(`/content/delete-content`, { data: body });

        if (deleteContent.status === 200) {
            setTimeout(async () => {
                toast.success('Content deleted successfully!');
                setIsLoading(false);
                onClose();
                await queryClient.invalidateQueries({
                    queryKey: ['allContent'],
                });
            }, 1000);
        } else {
            toast.error('Failed to delete content. Please try again.');
            console.error('Failed to delete content:', deleteContent);
        }
        return;
    };
    return (
        <>
            {open && (
                <div className="fixed h-screen w-screen top-0 left-0 flex justify-center z-[9999]">
                    {/* Background Overlay */}
                    <div className="absolute w-full h-full bg-black opacity-85"></div>

                    <div className="relative flex flex-col justify-center max-w-lg mx-auto">
                        <span className="bg-white p-4 rounded-md shadow-lg">
                            <div className="flex flex-col items-end justify-end mb-4">
                                <div className="cursor-pointer" onClick={onClose}>
                                    <CloseIcon />
                                </div>
                                <div className="flex flex-col items-center gap-4 justify-center border border-slate-300 rounded-md p-4">
                                    <p>Are you sure you want to delete this content?</p>
                                    <div className="flex items-center justify-center gap-2">
                                        <Button
                                            variants="info"
                                            text="Cancel"
                                            size="md"
                                            onClick={onClose}
                                            startIcon={<CloseIcon />}
                                        />
                                        <Button
                                            variants="danger"
                                            text="Delete"
                                            size="md"
                                            onClick={onDelete}
                                            startIcon={<DeleteIcon />}
                                            loading={isLoading}
                                        />
                                    </div>
                                </div>
                            </div>
                        </span>
                    </div>
                </div>
            )}
        </>
    );
};
