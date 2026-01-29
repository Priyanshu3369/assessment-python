const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiClient {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
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
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
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
        return this.request('/profile', {
            method: 'POST',
            body: JSON.stringify(data),
        });
    }

    async updateProfile(data) {
        return this.request('/profile', {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    }

    // Query endpoints
    async getProjects(skill = null) {
        const endpoint = skill ? `/projects?skill=${encodeURIComponent(skill)}` : '/projects';
        return this.request(endpoint);
    }

    async getSkills() {
        return this.request('/skills');
    }

    async getTopSkills(limit = 5) {
        return this.request(`/skills/top?limit=${limit}`);
    }

    async search(query) {
        return this.request(`/search?q=${encodeURIComponent(query)}`);
    }
}

export const api = new ApiClient(API_BASE_URL);
export default api;
