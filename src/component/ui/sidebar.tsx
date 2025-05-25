import { HomeIcon } from '../../icons/HomeIcon';

export const Sidebar = () => {
    return (
        <>
            <div
                id="sidebar"
                className="bg-slate-200 dark:bg-slate-600 w-18 md:w-1/5 p-4 bg-slate-200-400 shadow-2xl"
            >
                <ul className="flex flex-col gap-2">
                    <li className="flex items-center gap-2">
                        <HomeIcon />
                        <span className="dark:text-white font-medium">Dashboard</span>
                    </li>
                </ul>
            </div>
        </>
    );
};
