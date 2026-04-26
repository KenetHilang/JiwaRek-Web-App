import ErrorImage from './../../../assets/no-pic.jpg';
import { GoArrowUpRight } from "react-icons/go";

interface MaterialCardProps {
    imageURL: string;
    title: string;
    author: string;
    description: string;
    link: string;
    publishedDate?: string;
    index?: number;
}

function MaterialCards({ imageURL, title, author, description, link, publishedDate }: MaterialCardProps) {
    const handleImageError = (e: any) => {
        e.target.src = ErrorImage;
    };

    return (
        <div className="group rounded-lg overflow-hidden shadow-lg bg-white border-2 border-gray-300 hover:border-gray-400 cursor-pointer transition-all" onClick={() => window.open(link, '_blank')}>
            <div>
                <div>
                    <img 
                        className="w-full h-48 object-cover group-hover:opacity-90" 
                        src={imageURL || ErrorImage} 
                        alt={title}
                        onError={handleImageError}
                    />
                </div>
                <div className='p-2'>
                    <div className='mt-2 px-2 text-sm text-gray-500 h-5 overflow-hidden'>
                        <p>
                            {author}
                        </p>
                    </div>
                    <div className="px-2 mt-2">
                        <div className="spline spline-bold text-md mb-2 h-12 overflow-hidden group-hover:underline">{title?.length > 70 ? `${title.substring(0, 70)}...` : title}
                        <GoArrowUpRight className="inline-block ml-1 mb-1" />
                        </div>


                        <div className="mb-4">
                            <p className="text-gray-700 overflow-hidden text-sm h-10">
                                {description?.length > 150 ? `${description.substring(0, 150)}...` : description}
                            </p>
                        </div>
                    </div>
                    <div className="mt-1 px-2 pb-3 text-sm text-gray-500">
                        <p>{publishedDate}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MaterialCards;