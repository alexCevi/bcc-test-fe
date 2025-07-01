import axiosInstance from './axiosInstance';

// Get all certification requests
export const getCertificationRequests = async () => {
    try {
        const response = await axiosInstance.get('/certifications');
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to fetch certification requests'
        };
    }
};

// Create a new certification request
export const createCertificationRequest = async (requestData) => {
    try {
        const response = await axiosInstance.post('/certifications', requestData);
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to create certification request'
        };
    }
};

// Update certification request status (for supervisors)
export const updateCertificationStatus = async (requestId, status) => {
    try {
        const response = await axiosInstance.patch(`/certifications/${requestId}/status`, { status });
        return {
            success: true,
            data: response.data
        };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || 'Failed to update certification status'
        };
    }
};