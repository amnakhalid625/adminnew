import { useState, useRef } from "react";
import { UploadCloud, X } from "lucide-react";

const ImageUpload = ({ onUpload, existingImages = [] }) => {
    const [files, setFiles] = useState(
        existingImages.map((url) => ({ file: null, name: url, url }))
    );
    const fileInputRef = useRef(null);

    // ✅ MAIN FIX: Proper image URL function
    const getImageUrl = (file) => {
        // If it's a new upload (blob URL), return as is
        if (file.url.startsWith("blob:")) {
            return file.url;
        }
        
        // For existing images from backend
        let imagePath = file.url;
        
        // Clean up the path
        if (!imagePath.startsWith('/')) {
            imagePath = '/' + imagePath;
        }
        
        // Remove double slashes
        imagePath = imagePath.replace(/\/+/g, '/');
        
        // Return with backend URL
        return `http://localhost:8080${imagePath}`;
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        
        selectedFiles.forEach(file => {
            console.log('Selected file:', {
                name: file.name,
                type: file.type,
                size: file.size
            });
        });

        const fileObjects = selectedFiles.map((file) => ({
            file,
            name: file.name,
            url: URL.createObjectURL(file),
        }));

        const updatedFiles = [...files, ...fileObjects];
        setFiles(updatedFiles);

        if (onUpload) {
            const newFiles = updatedFiles.map((f) => f.file).filter(Boolean);
            onUpload(newFiles);
        }
    };

    const handleRemoveFile = (fileName) => {
        const updatedFiles = files.filter((file) => file.name !== fileName);
        setFiles(updatedFiles);

        if (onUpload) {
            onUpload(updatedFiles.map((f) => f.file).filter(Boolean));
        }
    };

    return (
        <div>
            <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-gray-50 transition-colors"
                onClick={() => fileInputRef.current.click()}
            >
                <UploadCloud className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600">
                    Drag & drop or click to upload
                </p>
                <p className="text-xs text-gray-500 mt-1">
                    All image formats supported (PNG, JPG, GIF, WEBP, AVIF, HEIC, etc.) up to 50MB
                </p>
                <input
                    type="file"
                    multiple
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.jpg,.jpeg,.png,.gif,.webp,.bmp,.tiff,.svg,.avif,.heic,.heif,.ico,.jfif"
                />
            </div>

            {files.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {files.map((file, index) => (
                        <div key={index} className="relative group">
                            <div className="relative w-full h-24 bg-gray-100 rounded-lg border overflow-hidden">
                                <img
                                    src={getImageUrl(file)}
                                    alt={file.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        console.error('Image load error for:', file.name);
                                        console.error('Tried URL:', getImageUrl(file));
                                        e.target.style.display = 'none';
                                        
                                        // Show error message
                                        const parent = e.target.parentElement;
                                        if (parent && !parent.querySelector('.error-placeholder')) {
                                            const errorDiv = document.createElement('div');
                                            errorDiv.className = 'error-placeholder absolute inset-0 flex items-center justify-center text-red-400 text-xs bg-red-50';
                                            errorDiv.innerHTML = '❌ Load Error';
                                            parent.appendChild(errorDiv);
                                        }
                                    }}
                                    onLoad={() => {
                                        console.log('✅ Image loaded:', file.name);
                                    }}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() => handleRemoveFile(file.name)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                            >
                                <X size={14} />
                            </button>
                            
                            {/* File name display */}
                            <div className="text-xs text-gray-500 mt-1 text-center truncate" title={file.name}>
                                {file.name.length > 20 ? file.name.substring(0, 20) + '...' : file.name}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;