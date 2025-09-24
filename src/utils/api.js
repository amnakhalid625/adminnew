const API_URL = "https://backend-production-5823.up.railway.app/api/admin"; // Your backend admin URL

// A helper function to handle API requests
const apiRequest = async (endpoint, method = 'GET', body = null) => {
    try {
        const config = {
            method,
            headers: {
                'Content-Type': 'application/json',
                // In a real app with token auth, you would add:
                // 'Authorization': `Bearer ${your_auth_token}`
            },
        };

        if (body) {
            config.body = JSON.stringify(body);
        }

        const response = await fetch(`${API_URL}${endpoint}`, config);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Something went wrong');
        }

        return data;
    } catch (error) {
        console.error(`API Error on ${method} ${endpoint}:`, error);
        throw error;
    }
};

export default apiRequest;