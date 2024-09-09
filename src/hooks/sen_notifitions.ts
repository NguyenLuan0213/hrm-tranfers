import { useCallback } from 'react';

const useNotification = () => {
    const sendNotification = useCallback((title: string, role: string, userTo: number, navigate: string) => {
        const newNotification = {
            title,
            role,
            userTo,
            navigate,
        };
        let storedNotifications = JSON.parse(sessionStorage.getItem('notifications') || '[]');
        storedNotifications.push(newNotification);
        sessionStorage.setItem('notifications', JSON.stringify(storedNotifications));
    }, []);

    return { sendNotification };
};

export default useNotification;