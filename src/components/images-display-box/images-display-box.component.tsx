import { LiaTimesSolid } from "@/assets";
import GenericImage from "../generic-image/generic-image.component";


type ImagesDisplayBoxProps = {
  className?: string;
  images: string[];
  onRemoveImage: (image: string) => void;
};

const ImagesDisplayBox = ({
  className = "",
  images,
  onRemoveImage,
}: ImagesDisplayBoxProps) => {
  return (
    <div className={`${className} flex items-start justify-start gap-2`}>
      {images && images.map((image, index) => (
        <div
          key={index}
          className="relative w-[6rem] aspect-square rounded-md overflow-hidden border border-dark-variant bg-gray-variant"
        >
          <GenericImage src={image} className="w-full h-full object-contain object-center" alt={`Selected ${index + 1}`} />
          <button
            type="button"
            className="absolute top-1 right-1 w-6 aspect-square rounded-sm p-1 bg-white/20 backdrop-blur-md text-black text-lg flex items-center justify-center"
            onClick={() => onRemoveImage(image)}
          >
            <LiaTimesSolid />
          </button>
        </div>
      ))}
    </div>
  );
};

export default ImagesDisplayBox;
