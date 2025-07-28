import axios from 'axios';
import { BASE_URL } from './apiClient';

export const notifyAllOverdue = async (): Promise<{ message: string }> => {
    console.log("notifyAllOverdue called");
    try {
        console.log("Making API call to notify overdue readers");
        const response = await axios.post(`${BASE_URL}/notifications/notify-overdue`, {}, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        console.log("API response received:", response.data);
        return response.data;
    } catch (error) {
        console.error("Error notifying overdue:", error);
        throw error;
    }
};
