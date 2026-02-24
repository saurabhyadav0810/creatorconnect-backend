import { useEffect, useState } from 'react';
import { getPublicAssets } from '../api/assetApi';
import styles from './Dashboard.module.css';

const Dashboard = () => {
    const [publicAssets, setPublicAssets] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPublicAssets = async () => {
            try {
                const response = await getPublicAssets();
                if (response.success) {
                    setPublicAssets(response.data);
                } else {
                    setError(response.message || 'Failed to load public assets');
                }
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to load public assets');
            } finally {
                setIsLoading(false);
            }
        };

        fetchPublicAssets();
    }, []);

    return (
        <div className={styles["dashboard-container"]}>
            <div className={styles["dashboard-content"]}>
                <div className={styles["dashboard-section"]}>
                    <h2>Explore Public Assets</h2>
                    {isLoading ? (
                        <div className={styles["empty-state"]}>
                            <h2>Loading assets...</h2>
                        </div>
                    ) : error ? (
                        <div className={styles["empty-state"]}>
                            <h2>Unable to load assets</h2>
                            <p>{error}</p>
                        </div>
                    ) : publicAssets.length > 0 ? (
                        <div className={styles["assets-grid"]}>
                            {publicAssets.map((asset) => (
                                <div key={asset._id} className={styles["asset-card"]}>
                                    <div className={styles["asset-image"]}>
                                        <img src={asset.mediaUrl} alt={asset.title} />
                                    </div>
                                    <div className={styles["asset-info"]}>
                                        <h3>{asset.title}</h3>
                                        <p className={styles.creator}>by {asset.owner?.name || 'Unknown'}</p>
                                        {/* <div className="asset-footer">
                                            <span className="likes">❤️ {asset.likes}</span>
                                        </div> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className={styles["empty-state"]}>
                            <h2>No public assets yet</h2>
                            <p>Public uploads will appear here.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
