import { useState, useRef } from "react";
import { UploadCloud, X } from "lucide-react";

const ImageUpload = ({ onUpload, existingImages = [] }) => {
    const [files, setFiles] = useState(
        existingImages.map((url) => ({ file: null, name: url, url }))
    );
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        
        // Log file details for debugging
        selectedFiles.forEach(file => {
            console.log('Selected file:', {
                name: file.name,
                type: file.type,
                size: file.size,
                lastModified: file.lastModified
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
            console.log('Uploading files:', newFiles);
            onUpload(newFiles); // Pass only actual new files
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
                            <img
                                src={
                                    file.url.startsWith("blob:")
                                        ? file.url
                                        : `http://localhost:8080${file.url}`
                                }
                                alt={file.name}
                                className="w-full h-24 object-cover rounded-lg border"
                                onError={(e) => {
                                    console.error('Image load error:', e);
                                    e.target.style.display = 'none';
                                }}
                            />
                            <button
                                type="button"
                                onClick={() => handleRemoveFile(file.name)}
                                className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X size={14} />
                            </button>
                            {/* Debug info - remove in production */}
                            {process.env.NODE_ENV === 'development' && (
                                <div className="text-xs text-gray-500 mt-1 text-center">
                                    {file.file?.type || 'existing'}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUpload;