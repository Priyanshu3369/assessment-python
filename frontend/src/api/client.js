const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Default credentials for write operations
// In production, these would be securely managed
const AUTH_USERNAME = import.meta.env.VITE_AUTH_USERNAME || 'admin';
const AUTH_PASSWORD = import.meta.env.VITE_AUTH_PASSWORD || 'secret123';

class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }

    getAuthHeader() {
        const credentials = btoa(`${AUTH_USERNAME}:${AUTH_PASSWORD}`);
        return `Basic ${credentials}`;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);

            // Handle 204 No Content
            if (response.status === 204) {
                return null;
            }

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Authenticated request for write operations
    async authRequest(endpoint, options = {}) {
        return this.request(endpoint, {
            ...options,
            headers: {
                ...options.headers,
                'Authorization': this.getAuthHeader(),
            },
        });
    }

    // Health check
    async health() {
        return this.request('/health');
    }

    // Profile endpoints
    async getProfile() {
        return this.request('/profile');
    }

    async createProfile(data) {
        return this.authRequest('/profile', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateProfile(data) {
        return this.authRequest('/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    async deleteProfile() {
        return this.authRequest('/profile', {
            method: 'DELETE',
        });
    }

    // Query endpoints with pagination
    async getProjects(skill = null, page = 1, pageSize = 10) {
        let endpoint = `/projects?page=${page}&page_size=${pageSize}`;
        if (skill) {
            endpoint += `&skill=${encodeURIComponent(skill)}`;
        }
        return this.request(endpoint);
    }

    async getSkills() {
        return this.request('/skills');
    }

    async getTopSkills(limit = 5) {
        return this.request(`/skills/top?limit=${limit}`);
    }

    async search(query, page = 1, pageSize = 10) {
        return this.request(`/search?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`);
    }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
