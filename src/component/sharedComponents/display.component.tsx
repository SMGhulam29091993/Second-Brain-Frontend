/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../config/axios.config';
import { NextIcon } from '../../icons/NextIcon';
import { PreviousIcon } from '../../icons/PreviousIcon';
import { useSourceStore } from '../../store/sourceStore';
import { AppLayout } from '../ui/appLayout';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface HeaderProps {
    setOpen: (open: boolean) => void;
    setDeleteModalOpen: (open: boolean) => void;
    setContentId: (id: string) => void;
    hideShareButton?: boolean; // Optional prop to hide share button
}

const Display: React.FC<HedaerProps> = ({ setOpen, setDeleteModalOpen, setContentId }) => {
    useEffect(() => {
        document.title = 'Dashboard | SecondBrain';
    }, []);

    const [source, setSource] = useState<string>('');
    const [pageNumber, setPageNumber] = useState<number>(1);
    const pageSize = 8;
    const [totalCount, setTotalCount] = useState<number>(0);

    const getSourceFromStore = useSourceStore((state) => state.source);

    useEffect(() => {
        const newSource = getSourceFromStore || '';
        if (newSource !== source) {
            setSource(newSource);
            setPageNumber(1);
        }
    }, [getSourceFromStore, source]);

    const fetchAllContent = async () => {
        const queryParams = new URLSearchParams();
        if (source) queryParams.append('source', source);
        queryParams.append('pageNumber', pageNumber.toString());
        queryParams.append('pageSize', pageSize.toString());
        const response = await api.get(`/content/get-all-content?${queryParams.toString()}`);
        return response.data;
    };

    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['allContent', source, pageNumber, pageSize],
        queryFn: fetchAllContent,
    });

    useEffect(() => {
        if (data?.data?.count !== undefined) {
            setTotalCount(data.data.count);
        }
    }, [data]);

    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                {[...Array(pageSize)].map((_, i) => (
                    <div key={i} className="h-[320px] w-full max-w-64 bg-slate-200 dark:bg-slate-800 animate-pulse rounded-3xl" />
                ))}
            </div>
        );
    }

    if (isError) {
        toast.error('Something went wrong. Please try again later.');
        console.error('Error fetching data:', error);
        return <div>Something Went Wrong</div>;
    }

    const totalPages = Math.ceil(totalCount / pageSize);

    const cardData =
        data?.data?.content.map((card: any) => ({
            id: card._id,
            title: card.title,
            link: card.link,
            source: card.source,
            summary: card.summary, // Pass summary to Card component
        })) || [];

    const handleLogout = async () => {
        try {
            const res = await api.post(`/user/logout`);
            if (!res.data.success) {
                toast.error('Unable to logout...');
                console.error('Unable to logout...');
            }
            clearToken();
            toast.success('Logout successful!');
            return;
        } catch (error) {
            console.error((error as Error).message);
        }
    };

    return (
        <div className="space-y-10 flex flex-col items-center sm:items-stretch">
            {/* Header / Stats */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 w-full text-center sm:text-left">
                <div>
                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2 capitalize">
                        {source ? source : 'All Memories'}
                    </h2>
                    <p className="text-slate-500 dark:text-slate-400 font-medium">
                        Showing <span className="text-blue-600 font-bold">{cardData.length}</span> of {totalCount} total items.
                    </p>
                </div>
            </div>

            {/* Grid */}
            <AnimatePresence mode="popLayout">
                {cardData.length > 0 ? (
                    <motion.div 
                        layout
                        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center w-full"
                    >
                        {cardData.map((card: any) => (
                            <Card
                                key={card._id}
                                id={card._id}
                                title={card.title}
                                link={card.link}
                                source={card.source}
                                summary={card.summary}
                                deleteOption={true}
                                setDeleteModalOpen={setDeleteModalOpen}
                                setContentId={setContentId}
                            />
                        ))}
                    </motion.div>
                ) : (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-32 text-center w-full"
                    >
                        <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-[3rem] mb-6">
                            <svg className="w-16 h-16 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                        </div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">No memories found</h3>
                        <p className="text-slate-500 dark:text-slate-400 max-w-xs mx-auto mb-8 font-medium">
                            Your second brain is empty. Start by adding your first piece of content!
                        </p>
                        <Button 
                            variants="primary" 
                            text="Add Content" 
                            size="lg" 
                            onClick={() => setOpen(true)} 
                        />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 pt-10 border-t border-slate-200 dark:border-slate-800 w-full">
                    <div className="flex items-center gap-4">
                        <Button
                            size="md"
                            text="Prev"
                            variants="secondary"
                            startIcon={<PreviousIcon />}
                            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                            disabled={pageNumber === 1}
                        />
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-slate-500">
                                {pageNumber} / {totalPages}
                            </span>
                        </div>
                        <Button
                            size="md"
                            text="Next"
                            variants="secondary"
                            endIcon={<NextIcon />}
                            onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
                            disabled={pageNumber === totalPages}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default AppLayout(Display);
