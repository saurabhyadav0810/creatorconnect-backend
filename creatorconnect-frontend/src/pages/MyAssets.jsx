import { useEffect, useState } from 'react';
import CreateAssetModal from '../components/CreateAssetModal';
import { getMyAssets } from '../api/assetApi';
import styles from './MyAssets.module.css';

const MyAssets = () => {
    const [myAssets, setMyAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchAssets = async () => {
            try {
                const response = await getMyAssets();
                if (response.success) {
                    setMyAssets(response.data);
                } else {
                    setError(response.message || 'Failed to load assets');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load assets');
            } finally {
                setIsLoading(false);
            }
        };

        fetchAssets();
    }, []);

    const handleCreateAsset = () => {
        setIsModalOpen(true);
    };

    const handleAssetCreated = (newAsset) => {
        setMyAssets([newAsset, ...myAssets]);
    };

    const handleDeleteAsset = (id) => {
        setMyAssets(myAssets.filter(asset => asset._id !== id));
    };

    return (
        <div className={styles["my-assets-container"]}>
            <div className={styles["my-assets-header"]}>
                <h1>My Assets</h1>
                <button className={styles["create-new-btn"]} onClick={handleCreateAsset}>+ Create New Asset</button>
            </div>

            <div className={styles["assets-content"]}>
                {isLoading ? (
                    <div className={styles["empty-state"]}>
                        <h2>Loading assets...</h2>
                    </div>
                ) : error ? (
                    <div className={styles["empty-state"]}>
                        <h2>Unable to load assets</h2>
                        <p>{error}</p>
                    </div>
                ) : myAssets.length > 0 ? (
                    <div className={styles["assets-grid"]}>
                        {myAssets.map((asset) => (
                            <div key={asset._id} className={styles["asset-card"]}>
                                <div className={styles["asset-image"]}>
                                    <img src={asset.mediaUrl} alt={asset.title} />
                                    <span className={`${styles["status-badge"]} ${styles[asset.visibility]}`}>
                                        {asset.visibility === 'public' ? 'Public' : 'Private'}
                                    </span>
                                </div>
                                <div className={styles["asset-info"]}>
                                    <h3>{asset.title}</h3>
                                    {/* <div className="asset-stats">
                                        <span>👁️ {asset.views}</span>
                                        <span>❤️ {asset.likes}</span>
                                    </div> */}
                                    {/* <div className="asset-actions">
                                        <button className="edit-btn">Edit</button>
                                        <button 
                                            className="delete-btn"
                                            onClick={() => handleDeleteAsset(asset.id)}
                                        >
                                            Delete
                                        </button>
                                    </div> */}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className={styles["empty-state"]}>
                        <h2>No assets yet</h2>
                        <p>Create your first asset to get started!</p>
                        <button className={styles["create-first-btn"]} onClick={handleCreateAsset}>+ Create Asset</button>
                    </div>
                )}
            </div>

            <CreateAssetModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                onAssetCreated={handleAssetCreated}
            />
        </div>
    );
};

export default MyAssets;
