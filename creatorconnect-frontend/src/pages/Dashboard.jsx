import { useEffect, useState } from 'react';
import { getPublicAssets } from '../api/assetApi';
import './Dashboard.css';

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
        <div className="dashboard-container">
            <div className="dashboard-content">
                <div className="dashboard-section">
                    <h2>Explore Public Assets</h2>
                    {isLoading ? (
                        <div className="empty-state">
                            <h2>Loading assets...</h2>
                        </div>
                    ) : error ? (
                        <div className="empty-state">
                            <h2>Unable to load assets</h2>
                            <p>{error}</p>
                        </div>
                    ) : publicAssets.length > 0 ? (
                        <div className="assets-grid">
                            {publicAssets.map((asset) => (
                                <div key={asset._id} className="asset-card">
                                    <div className="asset-image">
                                        <img src={asset.mediaUrl} alt={asset.title} />
                                    </div>
                                    <div className="asset-info">
                                        <h3>{asset.title}</h3>
                                        <p className="creator">by {asset.owner?.name || 'Unknown'}</p>
                                        {/* <div className="asset-footer">
                                            <span className="likes">❤️ {asset.likes}</span>
                                        </div> */}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
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
