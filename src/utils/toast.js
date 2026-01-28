import toast from 'react-hot-toast';

/**
 * Toast Notifications con estilo Smartfin
 */

export const showSuccess = (message) => {
    toast.success(message, {
        duration: 3000,
        style: {
            background: 'rgba(0, 255, 156, 0.1)',
            border: '1px solid rgba(0, 255, 156, 0.3)',
            color: '#00ff9c',
            backdropFilter: 'blur(10px)',
        },
        iconTheme: {
            primary: '#00ff9c',
            secondary: '#0f172a',
        },
    });
};

export const showError = (message) => {
    toast.error(message, {
        duration: 4000,
        style: {
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            backdropFilter: 'blur(10px)',
        },
        iconTheme: {
            primary: '#ef4444',
            secondary: '#0f172a',
        },
    });
};

export const showInfo = (message) => {
    toast(message, {
        duration: 3000,
        icon: '💡',
        style: {
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            color: '#8b5cf6',
            backdropFilter: 'blur(10px)',
        },
    });
};

export const showLoading = (message) => {
    return toast.loading(message, {
        style: {
            background: 'rgba(100, 116, 139, 0.1)',
            border: '1px solid rgba(100, 116, 139, 0.3)',
            color: '#94a3b8',
            backdropFilter: 'blur(10px)',
        },
    });
};

export const dismissToast = (toastId) => {
    toast.dismiss(toastId);
};
