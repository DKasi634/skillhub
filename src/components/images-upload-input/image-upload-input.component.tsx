import React, { forwardRef, useImperativeHandle, useRef, useState } from "react";
import ImagesDisplayBox from "../images-display-box/images-display-box.component";
import { SelectedImage } from "@/types";
import { setErrorToast } from "@/store/toast/toast.actions";
import { useDispatch } from "react-redux";
import { IoCloudUploadOutline } from "@/assets";
import { uploadToSupabaseStorage } from "@/utils/supabase/supabase.utils";

type ImagesUploadFormGroupProps = {
  imagesLimit: number;
  label: string;
  initialImages?: string[]; // Accepts remote image URLs
  folderPath: string;
};

const ImageUploadFormGroup = forwardRef<
{ uploadImages: () => Promise<string[]>, getAvailableRemoteImages: ()=> string[], hasSelectedImages:() => boolean },
  ImagesUploadFormGroupProps
>(
  ({ imagesLimit, label, folderPath, initialImages = [] }, uploadToStorageRef) => {
    const [selectedImages, setSelectedImages] = useState<SelectedImage[]>([]);
    const [remoteImages, setRemoteImages] = useState<string[]>(initialImages); // State for remote images
    const dispatch = useDispatch();
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const showErrorToast = (message: string) => {
      dispatch(setErrorToast(message));
    };

    /**
     * Compress an image file while maintaining quality.
     * @param file - The image file to compress.
     * @returns A Blob representing the compressed image.
     */
    const compressImage = async (file: File): Promise<Blob> => {
      return new Promise((resolve, reject) => {
        const img = new Image();
        const reader = new FileReader();

        reader.onload = (e) => {
          if (!e.target || !e.target.result) return reject("Failed to load image");
          img.src = e.target.result.toString();
        };

        reader.onerror = () => reject("Error reading file");

        img.onload = () => {
          const canvas = document.createElement("canvas");
          const ctx = canvas.getContext("2d");

          if (!ctx) return reject("Canvas context not available");

          // Scale down the image to maintain quality while reducing size
          const MAX_WIDTH = 1920;
          const MAX_HEIGHT = 1080;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          ctx.drawImage(img, 0, 0, width, height);

          // Export the canvas as a compressed JPEG
          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject("Failed to compress image");
            },
            "image/jpeg",
            0.8 // Adjust compression quality (0.8 is a good balance)
          );
        };

        reader.readAsDataURL(file);
      });
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!e.target.files) return;
      const files = Array.from(e.target.files);

      // Check if adding new images exceeds the limit
      if (selectedImages.length + files.length > imagesLimit) {
        showErrorToast(`Vous ne pouvez pas ajouter plus de ${imagesLimit} image${imagesLimit > 1 ? "s" : ""}`);
        return;
      }

      const newSelectedImages: SelectedImage[] = [];

      for (const file of files) {
        if (file.size > 0.8 * 1024 * 1024) { //Compress all images above 0.8MB
          try {
            const compressedFile = await compressImage(file);
            const blobUrl = URL.createObjectURL(new File([compressedFile], file.name, { type: file.type }));
            newSelectedImages.push({ file: new File([compressedFile], file.name, { type: file.type }), url: blobUrl });
          } catch (error) {
            console.error("Compression failed:", error);
            showErrorToast("Échec de la compression de l'image. Veuillez réessayer.");
          }
        } else {
          newSelectedImages.push({ file, url: URL.createObjectURL(file) });
        }
      }

      setSelectedImages((prev) => [...prev, ...newSelectedImages]);
      e.target.value = "";
    };

    const handleUploadToStorage = async (): Promise<string[]> => {
      const urls: string[] = [];
      if (!selectedImages || !selectedImages.length) {
        return [];
      }
      for (const { file } of selectedImages) {
        const url = await uploadToSupabaseStorage(file, folderPath);
        if(url){
          urls.push(url);
        }
      }
      setSelectedImages([]); // Clear local images after upload
      return urls;
    };

    const hasSelectedImages = (): boolean => !!selectedImages.length;
    const getRemoteSelectedImages = () =>{
      return remoteImages
    }

    useImperativeHandle(uploadToStorageRef, () => ({
      uploadImages: handleUploadToStorage,
      hasSelectedImages,
      getAvailableRemoteImages:getRemoteSelectedImages
    }));

    const handleRemoveImage = (urlToRemove: string) => {
      // Remove from local images
      setSelectedImages((prev) =>
        prev.filter(({ url }) => url !== urlToRemove)
      );
      // Remove from remote images
      setRemoteImages((prev) => prev.filter((url) => url !== urlToRemove));
    };

    const triggerInputClick = () => {
      if (fileInputRef.current) {
        fileInputRef.current.click();
      }
    };

    return (
      <>
        <div className="flex flex-col justify-start w-full gap-1">
          <label
            className="text-dark w-fit text-left cursor-pointer block text-xs font-bold text-black/70"
            htmlFor="image"
          >
            {label}*
          </label>
          <div className="flex items-center justify-start gap-2">
            {selectedImages.length + remoteImages.length < imagesLimit && (
              <>
                <button
                  type="button"
                  onMouseDown={triggerInputClick}
                  className="flex flex-col items-center justify-center gap-2 px-4 py-2 rounded-lg border-[1.5px] border-orange bg-gray-variant w-[6rem] cursor-pointer"
                >
                  <span className="text-xl">
                    <IoCloudUploadOutline />
                  </span>
                  <span className="text-sm text-dark font-semibold w-full text-center">
                    Upload
                  </span>
                </button>
                <input
                  type="file"
                  id="image"
                  name="image"
                  multiple={imagesLimit > 1}
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden px-4 py-[0.6rem] rounded-lg bg-gray-variant text-dark text-xs font-medium"
                />
              </>
            )}
            <ImagesDisplayBox
              images={[...selectedImages.map(({ url }) => url), ...remoteImages]}
              onRemoveImage={handleRemoveImage}
            />
          </div>
        </div>
      </>
    );
  }
);

export default ImageUploadFormGroup;