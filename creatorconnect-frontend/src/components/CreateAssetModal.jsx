import { useState } from 'react';
import { uploadSingleMedia } from '../api/uploadApi';
import { createAsset } from '../api/assetApi';
import './CreateAssetModal.css';

const CreateAssetModal = ({ isOpen, onClose, onAssetCreated }) => {
    const [assetData, setAssetData] = useState({
        title: '',
        description: '',
        category: 'photography',
        visibility: 'private'
    });
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setAssetData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            
            // Create preview for images
            if (file.type.startsWith('image/')) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    setPreview(reader.result);
                };
                reader.readAsDataURL(file);
            } else if (file.type.startsWith('video/')) {
                setPreview('📹 Video Selected: ' + file.name);
            }
            setError(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedFile) {
            setError('Please select a file to upload');
            return;
        }

        if (!assetData.title.trim()) {
            setError('Please enter an asset title');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Upload file to Cloudinary
            const uploadResponse = await uploadSingleMedia(selectedFile);

            if (uploadResponse.success) {
                const createResponse = await createAsset({
                    title: assetData.title,
                    description: assetData.description,
                    category: assetData.category,
                    visibility: assetData.visibility,
                    mediaUrl: uploadResponse.data.url,
                    publicId: uploadResponse.data.publicId,
                    resourceType: uploadResponse.data.resourceType
                });

                if (createResponse.success) {
                    onAssetCreated(createResponse.data);

                    setAssetData({
                        title: '',
                        description: '',
                        category: 'photography',
                        visibility: 'private'
                    });
                    setSelectedFile(null);
                    setPreview(null);
                    onClose();
                } else {
                    setError(createResponse.message || 'Asset creation failed');
                }
            } else {
                setError(uploadResponse.message || 'Upload failed');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Upload failed. Please try again.');
            console.error('Upload error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        console.log('Modal is closed (isOpen=false)');
        return null;
    }

    console.log('Modal is rendering with isOpen=true');

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <h2>Create New Asset</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="asset-form">
                    <div className="form-group">
                        <label htmlFor="title">Asset Title *</label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={assetData.title}
                            onChange={handleInputChange}
                            placeholder="Enter asset title"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description">Description</label>
                        <textarea
                            id="description"
                            name="description"
                            value={assetData.description}
                            onChange={handleInputChange}
                            placeholder="Enter asset description (optional)"
                            rows="4"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="category">Category</label>
                        <select
                            id="category"
                            name="category"
                            value={assetData.category}
                            onChange={handleInputChange}
                        >
                            <option value="photography">Photography</option>
                            <option value="videography">Videography</option>
                            <option value="illustration">Illustration</option>
                            <option value="animation">Animation</option>
                            <option value="design">Design</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="visibility">Visibility</label>
                        <select
                            id="visibility"
                            name="visibility"
                            value={assetData.visibility}
                            onChange={handleInputChange}
                        >
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="file">Upload Image or Video *</label>
                        <div className="file-upload-area">
                            {preview ? (
                                <div className="preview">
                                    {selectedFile.type.startsWith('image/') ? (
                                        <img src={preview} alt="Preview" />
                                    ) : (
                                        <div className="video-preview">{preview}</div>
                                    )}
                                </div>
                            ) : (
                                <div className="upload-placeholder">
                                    <span>📁</span>
                                    <p>Click to upload or drag and drop</p>
                                    <small>Images or Videos (up to 100MB)</small>
                                </div>
                            )}
                            <input
                                type="file"
                                id="file"
                                onChange={handleFileSelect}
                                accept="image/*,video/*"
                                required
                                className="file-input"
                            />
                        </div>
                    </div>

                    {error && <div className="error-message">{error}</div>}

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn-cancel"
                            onClick={onClose}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn-create"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Uploading...' : 'Create Asset'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateAssetModal;
