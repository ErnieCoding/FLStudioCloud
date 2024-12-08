const BASE_URL = 'http://ec2-54-82-5-168.compute-1.amazonaws.com'; // Replace with your backend URL

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
        console.error('No refresh token available. Logging out.');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw new Error('No refresh token available.');
    }

    try {
        const response = await fetch(`${BASE_URL}/api/token/refresh/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('accessToken', data.access);
            return data.access;
        } else {
            const errorData = await response.json();
            console.error(`Failed to refresh access token: ${errorData.detail}`);
            // Clear tokens and redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            throw new Error('Failed to refresh access token.');
        }
    } catch (error) {
        console.error('Error during token refresh:', error);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        throw error;
    }
};

export const fetchWithAuth = async (url, options = {}) => {
    let accessToken = localStorage.getItem('accessToken');
    const headers = options.headers || {};

    console.log("Using Access Token:", accessToken); // Debugging: Log the token

    try {
        const response = await fetch(`${BASE_URL}${url}`, {
            ...options,
            headers: {
                ...headers,
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (response.status === 401) {
            console.warn("Access token expired. Attempting to refresh...");
            accessToken = await refreshAccessToken();

            console.log("Refreshed Access Token:", accessToken); // Debugging: Log the refreshed token

            // Retry the original request with the new token
            return fetch(`${BASE_URL}${url}`, {
                ...options,
                headers: {
                    ...headers,
                    Authorization: `Bearer ${accessToken}`,
                },
            });
        }

        return response;
    } catch (error) {
        console.error("Error in fetchWithAuth:", error);
        throw error;
    }
};
