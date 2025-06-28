import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import api from '../../config/axios.config';
import { LogoutIcon } from '../../icons/LogoutIcon';
import { NextIcon } from '../../icons/NextIcon';
import { PlusIcon } from '../../icons/PlusIcons';
import { PreviousIcon } from '../../icons/PreviousIcon';
import { ShareIcon } from '../../icons/ShareIcons';
import { useAuthStore } from '../../store/authStore';
import { useSourceStore } from '../../store/sourceStore';
import { AppLayout } from '../ui/appLayout';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import toast from 'react-hot-toast';

interface HedaerProps {
    setOpen: (open: boolean) => void;
}

const Display: React.FC<HedaerProps> = ({ setOpen }) => {
    useEffect(() => {
        document.title = 'Dashboard | Second Brain';
    }, []);
    const [source, setSource] = useState<string>(''); // Default source
    const [pageNumber, setPageNumber] = useState<number>(1); // Default page number
    const pageSize = 10; // Default page size
    const [totalCount, setTotalCount] = useState<number>(0); // Total count of items

    const getSourceFromStore = useSourceStore((state) => state.source);
    const clearToken = useAuthStore((state) => state.clearToken);

    // Add state for loading
    const [isCreatingShareLink, setIsCreatingShareLink] = useState<boolean>(false);

    const createShareLink = async () => {
        setIsCreatingShareLink(true);

        try {
            const resp = await api.post(`/link/brain-link`, { shareBrain: true });

            if (resp.data && resp.data.data && resp.data.data.link) {
                const shareLink = resp.data.data.link;
                toast.success('Share link created successfully!');
                // Copy the link to clipboard
                await navigator.clipboard.writeText(shareLink);
                alert('Share link copied to clipboard! : ' + shareLink);
            } else {
                throw new Error('Invalid response format');
            }
        } catch (error: any) {
            console.error('Error creating share link:', error);

            let errorMessage = 'Failed to create share link. ';

            if (error.response) {
                // Server responded with error status
                switch (error.response.status) {
                    case 500:
                        errorMessage += 'Server error. Please try again later.';
                        break;
                    case 401:
                        errorMessage += 'Please log in again.';
                        break;
                    case 403:
                        errorMessage += "You don't have permission to create share links.";
                        break;
                    default:
                        errorMessage += `Server error (${error.response.status}).`;
                }
            } else if (error.request) {
                // Network error
                errorMessage += 'Network error. Please check your connection.';
            } else {
                // Other error
                errorMessage += error.message || 'Unknown error occurred.';
            }
        } finally {
            setIsCreatingShareLink(false);
        }
    };

    // Effect to update source from store when it changes
    useEffect(() => {
        const newSource = getSourceFromStore || '';
        if (newSource !== source) {
            setSource(newSource); // Set source from store or default to empty string
            setPageNumber(1); // Reset to first page when source changes
        }
    }, [getSourceFromStore, source]);

    // Function to fetch all content based on source, pageNumber, and pageSize
    const fetchAllContent = async () => {
        const queryParams = new URLSearchParams();
        if (source) queryParams.append('source', source);
        queryParams.append('pageNumber', pageNumber.toString());
        queryParams.append('pageSize', pageSize.toString());
        const response = await api.get(`/content/get-all-content?${queryParams.toString()}`);
        setTotalCount(response.data.data.count || 0); // Set total count from response
        return response.data;
    };

    // Use React Query to fetch data
    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['allContent', source, pageNumber, pageSize],
        queryFn: fetchAllContent,
    });

    // Effect to update total count when data changes
    useEffect(() => {
        setTotalCount(data?.data?.count || 0); // Update total count when data changes
    }, [source, pageNumber]);

    if (isLoading) {
        return (
            <div className="dark:text-white text-black flex flex-col items-center text-lg font-bold">
                Loading...
            </div>
        );
    }

    if (isError) {
        toast.error('Something went wrong. Please try again later.');
        console.error('Error fetching data:', error);
        return <div>Something Went Wrong</div>;
    }

    let totalPages = Math.ceil(totalCount / pageSize);

    const cardData =
        data?.data?.content.map((card: any) => ({
            id: card._id,
            title: card.title,
            link: card.link,
            source: card.source,
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
        <>
            <div className="flex flex-col items-center justify-center gap-3">
                <div className="fixed top-20 right-3 z-40">
                    <div className="flex flex-col flex-wrap md:flex-row  items-center gap-2">
                        <Button
                            variants="secondary"
                            text={isCreatingShareLink ? 'Creating...' : 'Share'}
                            startIcon={<ShareIcon />}
                            size="md"
                            onClick={createShareLink}
                        />
                        <Button
                            variants="primary"
                            text="Add Content"
                            startIcon={<PlusIcon />}
                            size="md"
                            onClick={() => setOpen(true)}
                        />
                        <Button
                            variants="secondary"
                            size="md"
                            text="Logout"
                            startIcon={<LogoutIcon />}
                            onClick={handleLogout}
                        />
                    </div>
                </div>
                <div className="flex items-center justify-center gap-2 flex-wrap">
                    {cardData.length > 0 ? (
                        cardData.map((card: any) => (
                            <Card
                                key={card.id}
                                id={card.id}
                                title={card.title}
                                link={card.link}
                                source={card.source}
                            />
                        ))
                    ) : (
                        <div className="dark:text-white text-black">No content available</div>
                    )}
                </div>
                {/* Pagination */}
                {cardData.length > 0 && totalPages > 1 && (
                    <div className="mt-3 flex justify-center items-center gap-3 fixed bottom-2 left-1/2 transform -translate-x-1/2 z-40">
                        <Button
                            size="sm"
                            text="Prev"
                            variants="primary"
                            startIcon={<PreviousIcon />}
                            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                            disabled={pageNumber === 1 ? true : false}
                        />
                        <span className="text-sm md:text-lg font-semibold dark:text-slate-500 text-black">
                            Page {pageNumber} of {totalPages}
                        </span>
                        <Button
                            size="sm"
                            text="Next"
                            variants="primary"
                            startIcon={<NextIcon />}
                            onClick={() => setPageNumber((prev) => Math.min(prev + 1, totalPages))}
                            disabled={pageNumber === totalPages ? true : false}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default AppLayout(Display);
