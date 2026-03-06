/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ComponentType, useState } from 'react';
import { AddContentModal } from '../sharedComponents/addContentModal.component';
import { Header } from '../sharedComponents/header.component';
import { DeleteContentModal } from '../sharedComponents/deleteModal.component';

export function AppLayout<T extends object>(WrappedComponent: ComponentType<T>) {
    return (props: any) => {
        const [open, setOpen] = useState<boolean>(false);

        const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
        const [contentId, setContentId] = useState<string>('');

        return (
            <div className="flex flex-col">
                <Header />
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
