import ErrorImage from './../../../assets/no-pic.jpg';
import { GoArrowUpRight } from "react-icons/go";

interface MaterialCardProps {
    imageURL: string;
    title: string;
    author: string;
    description: string;
    link: string;
    publishedDate?: string;
}

function MaterialCards({ imageURL, title, author, description, link, publishedDate }: MaterialCardProps) {
    const handleImageError = (e: any) => {
        e.target.src = ErrorImage;
    };

    return (
        <div className="max-w-sm rounded overflow-hidden shadow-lg m-4 bg-white hover:scale-105 transition-transform duration-300 cursor-pointer" onClick={() => window.open(link, '_blank')}>
            <div className='m-3'>
                <div className="p-1">
                    <img 
                        className="w-full h-48 object-cover rounded-md" 
                        src={imageURL || ErrorImage} 
                        alt={title}
                        onError={handleImageError}
                    />
                </div>
                <div className='mt-2 px-2 text-sm text-gray-500 h-5 overflow-hidden'>
                    <p>
                        {author}
                    </p>
                </div>
                <div className="px-2 mt-2">
                    <div className="font-bold text-md mb-2 h-12 overflow-hidden ">{title?.length > 70 ? `${title.substring(0, 70)}...` : title}
                    <GoArrowUpRight className="inline-block ml-1 mb-1" />
                    </div>


                    <div className="mb-4">
                        <p className="text-gray-700 text-base overflow-hidden text-sm h-10">
                            {description?.length > 150 ? `${description.substring(0, 150)}...` : description}
                        </p>
                    </div>
                </div>
                <div className="mt-1 px-2 text-sm text-gray-500">
                    <p>{publishedDate}</p>
                </div>
            </div>
        </div>
    );
}

export default MaterialCards;