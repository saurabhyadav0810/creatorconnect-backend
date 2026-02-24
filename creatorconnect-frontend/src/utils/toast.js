import toast from 'react-hot-toast';

export const showSuccess = (message) => {
    toast.success(message, {
        duration: 3000,
        position: 'top-right',
        style: {
            background: '#10B981',
            color: '#fff',
            fontSize: '14px',
            padding: '16px',
            borderRadius: '8px'
        },
        icon: '✓'
    });
};


export const showError = (message) => {
    toast.error(message, {
        duration: 4000,
        position: 'top-right',
        style: {
            background: '#EF4444',
            color: '#fff',
            fontSize: '14px',
            padding: '16px',
            borderRadius: '8px'
        },
        icon: '✕'
    });
};


export const showWarning = (message) => {
    toast(message, {
        duration: 3500,
        position: 'top-right',
        style: {
            background: '#F59E0B',
            color: '#fff',
            fontSize: '14px',
            padding: '16px',
            borderRadius: '8px'
        },
        icon: '⚠️'
    });
};


export const showInfo = (message) => {
    toast(message, {
        duration: 3000,
        position: 'top-right',
        style: {
            background: '#3B82F6',
            color: '#fff',
            fontSize: '14px',
            padding: '16px',
            borderRadius: '8px'
        },
        icon: 'ℹ️'
    });
};


export const showLoading = (message) => {
    return toast.loading(message, {
        position: 'top-right',
        style: {
            background: '#6B7280',
            color: '#fff',
            fontSize: '14px',
            padding: '16px',
            borderRadius: '8px'
        }
    });
};

export const updateToast = (toastId, message, type = 'success') => {
    if (type === 'success') {
        toast.success(message, {
            id: toastId,
            duration: 3000,
            style: {
                background: '#10B981',
                color: '#fff',
                fontSize: '14px',
                padding: '16px',
                borderRadius: '8px'
            }
        });
    } else if (type === 'error') {
        toast.error(message, {
            id: toastId,
            duration: 4000,
            style: {
                background: '#EF4444',
                color: '#fff',
                fontSize: '14px',
                padding: '16px',
                borderRadius: '8px'
            }
        });
    }
};


export const dismissToast = (toastId) => {
    toast.dismiss(toastId);
};


export const dismissAllToasts = () => {
    toast.dismiss();
};