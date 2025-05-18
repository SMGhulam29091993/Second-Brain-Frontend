import { useQuery } from '@tanstack/react-query';
import api from '../../config/axios.config';
import { AppLayout } from '../ui/appLayout';
import { Card } from '../ui/card';

const Display = () => {
    const fetchAllContent = async () => {
        const response = await api.get('/content/get-all-content');
        return response.data;
    };

    const { isLoading, isError, data, error } = useQuery({
        queryKey: ['allContent'],
        queryFn: fetchAllContent,
    });

    if (isLoading) {
        return <div className="flex flex-col items-center text-lg font-bold">Loading...</div>;
    }

    if (isError) {
        console.error('Error fetching data:', error);
        return <div>Something Went Wrong</div>;
    }

    const cardData =
        data?.data?.content.map((card: any) => ({
            id: card._id,
            title: card.title,
            link: card.link,
            source: card.source,
        })) || [];

    return (
        <>
            <div className="flex items-center justify-center gap-2 flex-wrap">
                {cardData.length > 0 ? (
                    cardData.map((card: any) => (
                        <Card
                            key={card.id}
                            title={card.title}
                            link={card.link}
                            source={card.source}
                        />
                    ))
                ) : (
                    <div>No content available</div>
                )}
            </div>
        </>
    );
};

export default AppLayout(Display);
