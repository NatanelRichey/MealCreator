import Image from 'next/image';

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  currentImage?: string;
}

export function ImageUpload({ onImageChange, currentImage }: ImageUploadProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageChange(file);
  };

  return (
    <div className="w-full mb-8">
      <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Image</h3>
      
      <div className="flex flex-col items-center w-full">
        {/* Image Preview */}
        {currentImage && (
          <div className="mb-4 relative w-32 h-32">
            <Image 
              src={currentImage} 
              alt="Meal preview"
              fill
              className="object-cover rounded-lg border-2 border-gray-300"
            />
          </div>
        )}
        
        {/* File Input */}
        <div className="relative">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            id="image-upload"
          />
          <label
            htmlFor="image-upload"
            className="inline-flex items-center px-6 py-3 bg-gray-100 border-2 border-gray-300 rounded-lg text-gray-700 text-lg font-medium cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Choose Image
          </label>
        </div>
        
        {!currentImage && (
          <p className="text-gray-500 text-sm mt-2">No image selected</p>
        )}
      </div>
    </div>
  );
}
