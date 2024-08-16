'use client';

import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Check, Loader2 } from 'lucide-react';
import { unsplash } from '@/lib/unsplash';
import { unsplashDefaultImages } from '@/constants/constant';
import Link from 'next/link';
import { FormErrors } from './form-errors';

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
}
export const FormPicker = ({ id, errors }: FormPickerProps) => {
  const { pending } = useFormStatus();
  const [images, setImages] = useState<Array<Record<string, any>>>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedImageId, setSelectedImageId] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ['31709'],
          count: 9,
        });
        if (result && result.response) {
          const resImages = result.response as Array<Record<string, any>>;
          setImages(resImages);
        }
        setImages(unsplashDefaultImages);
      } catch (error) {
        console.log('Unsplash fetch error!!', error);
        // setting the default images in case we have exceeded the api calls
        setImages(unsplashDefaultImages);
      } finally {
        setIsLoading(false);
      }
    };
    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-6 w-6 text-sky-700 animate-spin" />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-2 mb-2">
        {images.map((image) => (
          <div
            key={image.id}
            className={cn(
              'cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted',
              pending && 'opacity-50 hover:opacity-50 cursor-auto'
            )}
            onClick={() => {
              if (pending) {
                return;
              }
              setSelectedImageId(image.id);
            }}
          >
            <input
              type="radio"
              id={id}
              name={id}
              className="hidden"
              checked={selectedImageId === image.id}
              disabled={pending}
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.user.links.html}|${image.user.name}`}
            />
            <Image
              src={image.urls.thumb}
              alt="background"
              fill
              className="object-cover rounded-sm"
            />
            {selectedImageId === image.id && (
              <div className="relative z-30 bg-black/40 h-full w-full flex items-center justify-center">
                <Check className="text-white h-4 w-4" />
              </div>
            )}
            <Link
              href={image.links.html}
              target="_blank"
              className="opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[10px] truncate text-white hover:underline p-1 bg-black/10"
            >
              {image.user.name}
            </Link>
          </div>
        ))}
      </div>
      <FormErrors id="image" errors={errors} />
    </div>
  );
};
