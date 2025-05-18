import { ComponentType, useState } from 'react';
import { AddContentModal } from '../sharedComponents/addContentModal.component';
import { Header } from '../sharedComponents/header.component';
import { Sidebar } from './sidebar';

export function AppLayout<T extends object>(WrappedComponent: ComponentType<T>) {
    return (props: any) => {
        const [open, setOpen] = useState<boolean>(false);

        return (
            <div className="flex flex-col p-0">
                <Header setOpen={setOpen} />
                <AddContentModal open={open} onClose={() => setOpen(false)} />
                <div className="flex flex-row gap-2" style={{ height: 'calc(100vh - 4.5rem)' }}>
                    <Sidebar />
                    <div className="flex items-center justify-center flex-wrap gap-2 p-3 w-full h-full overflow-auto">
                        <WrappedComponent {...props} />
                    </div>
                </div>
            </div>
        );
    };
}
