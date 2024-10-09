import React, { useState, useRef } from 'react';

export default function ImageDrop({ onImageChange }) {
    const [previewImage, setPreviewImage] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        handleFile(file);
    };

    const handleFile = (file) => {
        if (file) {
            onImageChange(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    return (
        <div
            className={`relative h-64 border-2 border-dashed rounded-lg ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            } transition-colors duration-300 ease-in-out cursor-pointer`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current.click()}
        >
            <input
                type="file"
                id="avatar"
                name="avatar"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
                ref={fileInputRef}
            />
            {previewImage ? (
                <img
                    src={previewImage}
                    alt="Preview"
                    className="object-contain w-full h-full rounded-lg"
                />
            ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                    <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    <span className="text-sm text-center">
                        Drag and drop an image here,<br />or click anywhere to select
                    </span>
                </div>
            )}
        </div>
    );
}