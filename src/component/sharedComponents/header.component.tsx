import { useQuery, useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import api from '../../config/axios.config';
import { BrainIcon } from '../../icons/BrainIcon';
import { LogoutIcon } from '../../icons/LogoutIcon';
import { MoonIcon } from '../../icons/MoonIcon';
import { PlusIcon } from '../../icons/PlusIcons';
import { ShareIcon } from '../../icons/ShareIcons';
import { SunIcon } from '../../icons/SunIcon';
import { useSourceStore } from '../../store/sourceStore';
import { Button } from '../ui/button';

interface HeaderProps {
    setOpen: (open: boolean) => void;
}

export interface ContentDto {
    link: string;
    type: 'video' | 'image' | 'audio' | 'article' | 'repository';
    title: string;
    tags: string[]; // Array of tag IDs (validated as ObjectId in Zod)
    userId: string; // User ID (validated as ObjectId in Zod)
    source: 'youtube' | 'twitter' | 'facebook' | 'github';
    createdAt?: Date;
    updatedAt?: Date;
    _id?: string;
    __v?: number;
}

interface SourceDto {
    _id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
}

export const Header: React.FC<HeaderProps> = ({ setOpen }) => {
    const [source, setSource] = useState<string>(''); // Default source
    const [sourceArray, setSourceArray] = useState<SourceDto[]>([]); // State to hold sources

    const setSourceStore = useSourceStore((state) => state.setSource);

    // Check for theme in local storage and set it on the html element
    useEffect(() => {
        const theme = localStorage.getItem('theme');
        const html = document.querySelector('html');
        if (!html) return;
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }, []);

    // Change theme and set it in local storage
    // This function is called when the user clicks on the theme toggle button
    const changeTheme = () => {
        const html = document.querySelector('html');
        if (!html) return;
        const isDark = html.classList.toggle('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    };

    // Function to fetch all content sources from the API
    const fetchAllContentSources = async () => {
        const response = await api.get('/content/get-all-sources');
        return response.data;
    };

    // Fetch all content sources and invalidate the query to refresh the data
    const queryClient = useQueryClient();
    queryClient.invalidateQueries({
        queryKey: ['allSource'],
    });

    const { data: allSourceData } = useQuery({
        queryKey: ['allSource'],
        queryFn: fetchAllContentSources,
    });

    // Effect to set the source array from fetched data
    useEffect(() => {
        if (allSourceData && allSourceData.data) {
            setSourceArray(allSourceData.data || []); // Set sources from fetched data
        }
        return () => {
            setSourceArray([]); // Clear sources on unmount
        };
    }, [allSourceData]);

    // Effect to set the source from the store or default to empty string
    useEffect(() => {
        setSourceStore(source); // Always update the store, even if empty string
    }, [source, setSourceStore]);

    return (
        <div className="flex items-center justify-between p-4 text-white bg-slate-200 shadow-2xl dark:bg-slate-600 ">
            <div className="flex items-center gap-2 dark:text-slate-100">
                <BrainIcon />
                <h2 className="md:text-2xl font-bold text-slate-900 dark:text-slate-100">
                    <span className="text-orange-300 italic">Second</span> Brain
                </h2>
            </div>
            <div
                onClick={changeTheme}
                className="flex items-center gap-2 absolute left-1/2 transform -translate-x-1/2 cursor-pointer"
            >
                <div className="hidden dark:block relative">
                    <SunIcon />
                </div>
                <div className="block dark:hidden relative">
                    <MoonIcon />
                </div>
            </div>
            <div className="flex items-center gap-2">
                <select
                    id="source"
                    className="bg-slate-700 border border-slate-400 rounded-md p-2 capitalize"
                    value={source}
                    onChange={(e) => setSource((e.target as HTMLSelectElement).value || '')}
                >
                    <option value="">All Content</option>
                    {sourceArray.map((source) => (
                        <option
                            key={source._id}
                            value={source.name}
                            className="capitalize dark:bg-black dark:text-white bg-slate-700 text-white"
                        >
                            {source.name}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
