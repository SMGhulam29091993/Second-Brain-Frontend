import { DeleteIcon } from '../../icons/DeleteIcons';
import { ShareIcon } from '../../icons/ShareIcons';

interface CardProps {
    title: string;
    type: 'youtube' | 'facebook' | 'twitter' | 'github';
    link: string;
}

export const Card = ({ title, type, link }: CardProps) => {
    return (
        <>
            <div className="p-3 flex flex-col justify-center bg-slate-200 rounded-md border-amber-400 shadow-lg min-w-72 min-h-52">
                <div className="flex items-center justify-between gap-4">
                    <div className="cursor-text font-semibold w-32">
                        <h4 className="truncate">{title}</h4>
                    </div>
                    <div className="flex items-center gap-2 cursor-pointer">
                        <span className="hover:bg-slate-300 p-2 rounded-full transition-all duration-300">
                            <ShareIcon />
                        </span>
                        <span className="hover:bg-slate-300 p-2 rounded-full transition-all duration-300">
                            <DeleteIcon />
                        </span>
                    </div>
                </div>
                <div className="mt-2 hover:scale-102 transition-all duration-300 cursor-pointer">
                    {type === 'youtube' && (
                        <iframe
                            className="w-full"
                            src={link.replace('watch', 'embed').replace('?v=', '/')}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                        ></iframe>
                    )}
                    {type === 'twitter' && (
                        <blockquote className="twitter-tweet">
                            <a href={link.replace('x', 'twitter')}></a>
                        </blockquote>
                    )}
                    {type === 'facebook' && (
                        <iframe
                            src={link}
                            width="300"
                            height="300"
                            style={{ border: 'none', borderRadius: '7px', overflow: 'hidden' }}
                            scrolling="no"
                            frameBorder="0"
                            allowFullScreen={true}
                            allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share"
                        ></iframe>
                    )}
                </div>
            </div>
        </>
    );
};
