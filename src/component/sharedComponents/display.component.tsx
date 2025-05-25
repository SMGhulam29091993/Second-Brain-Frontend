import { useQuery } from '@tanstack/react-query';
import { use, useEffect, useState } from 'react';
import api from '../../config/axios.config';
import { NextIcon } from '../../icons/NextIcon';
import { PreviousIcon } from '../../icons/PreviousIcon';
import { useSourceStore } from '../../store/sourceStore';
import { AppLayout } from '../ui/appLayout';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

const Display = () => {
    const [source, setSource] = useState<string>(''); // Default source
    const [pageNumber, setPageNumber] = useState<number>(1); // Default page number
    const pageSize = 10; // Default page size
    const [totalCount, setTotalCount] = useState<number>(0); // Total count of items

    const getSourceFromStore = useSourceStore((state) => state.source);

    useEffect(() => {
        const newSource = getSourceFromStore || '';
        if (newSource !== source) {
            setSource(newSource); // Set source from store or default to empty string
            setPageNumber(1); // Reset to first page when source changes
        }
    }, [getSourceFromStore, source]);

    const fetchAllContent = async () => {
        const queryParams = new URLSearchParams();
        if (source) queryParams.append('source', source);
        queryParams.append('pageNumber', pageNumber.toString());
        queryParams.append('pageSize', pageSize.toString());
        const response = await api.get(`/content/get-all-content?${queryParams.toString()}`);
        setTotalCount(response.data.data.count || 0); // Set total count from response
        return response.data;
    };

    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['allContent', source, pageNumber, pageSize],
        queryFn: fetchAllContent,
    });

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
        console.error('Error fetching data:', error);
        return <div>Something Went Wrong</div>;
    }

    // let totalCount = data?.data?.count || 0;
    let totalPages = Math.ceil(totalCount / pageSize);

    const cardData =
        data?.data?.content.map((card: any) => ({
            id: card._id,
            title: card.title,
            link: card.link,
            source: card.source,
        })) || [];

    return (
        <>
            <div className="flex flex-col items-center justify-center gap-3">
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
                    <div className=" mt-3 flex justify-center items-center gap-3 fixed bottom-2 left-1/2 transform -translate-x-1/2">
                        <Button
                            size="sm"
                            text="Prev"
                            variants="primary"
                            startIcon={<PreviousIcon />}
                            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                            disabled={pageNumber === 1 ? true : false}
                        />
                        <span className="text-lg font-semibold dark:text-slate-500 text-black">
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
