/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, useState } from 'react';
import { AddContentModal } from '../sharedComponents/addContentModal.component';
import { Header } from '../sharedComponents/header.component';
import { DeleteContentModal } from '../sharedComponents/deleteModal.component';
import { useLocation } from 'react-router-dom';

export function AppLayout<T extends object>(WrappedComponent: ComponentType<T>) {
    return (props: any) => {
        const location = useLocation();
        const [open, setOpen] = useState<boolean>(false);

        const showSource = location.pathname.split('/')[1] === 'shared-summary';

        const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
        const [contentId, setContentId] = useState<string>('');

        return (
            <div className="flex flex-col">
                <Header showSource={showSource} />
                <AddContentModal open={open} onClose={() => setOpen(false)} />
                <DeleteContentModal
                    open={deleteModalOpen}
                    onClose={() => setDeleteModalOpen(false)}
                    contentId={contentId}
                />
                <div className="flex flex-col gap-2" style={{ height: 'calc(100vh - 4.55rem)' }}>
                    <div className="flex items-center justify-center flex-wrap gap-2 p-3 w-full h-full overflow-auto">
                        <WrappedComponent
                            {...props}
                            setOpen={setOpen}
                            setDeleteModalOpen={setDeleteModalOpen}
                            setContentId={setContentId}
                        />
                    </div>
                </div>
            </div>
        );
    };
}
