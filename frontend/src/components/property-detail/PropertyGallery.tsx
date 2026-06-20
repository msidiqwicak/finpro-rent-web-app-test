import React from 'react';

interface PropertyGalleryProps {
  images: string[];
  propertyName: string;
}

export default function PropertyGallery({ images, propertyName }: PropertyGalleryProps) {
  return (
    <div className="rounded-2xl overflow-hidden mb-10">
      <div className={`grid gap-2 ${images.length >= 5 ? 'grid-cols-4 grid-rows-2 h-[400px] md:h-[500px]' : images.length >= 2 ? 'grid-cols-2 h-[300px] md:h-[400px]' : 'grid-cols-1 aspect-[16/9] md:aspect-[21/9]'}`}>
        {images.slice(0, 5).map((url, i) => (
          <div key={i} className={`relative w-full h-full overflow-hidden rounded-xl ${i === 0 && images.length >= 5 ? 'col-span-2 row-span-2' : ''}`}>
            <img src={url} alt={`${propertyName} - ${i + 1}`} className="w-full h-full object-cover object-center hover:scale-105 transition-transform duration-500 bg-surface-container-high" />
          </div>
        ))}
      </div>
    </div>
  );
}
