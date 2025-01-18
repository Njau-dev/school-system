import axios from 'axios';

const transformData = (data, role) => {

    switch (role) {
        case 'student':
            return data.map(item => ({
                id: item.id,
                title: item.title,
                lecturer: item.lecturer || 'N/A',
                createdAt: new Date(item.createdAt).toLocaleDateString(),
                submissionStatus: item.submissionStatus || 'Pending'
            }));

        case 'lecturer':
        case 'admin':
            return data.map(item => ({
                id: item.id,
                title: item.title,
                createdAt: new Date(item.createdAt).toLocaleDateString(),
                hasSubmitted: item.hasSubmitted,
                lecturer: item.lecturer || 'N/A',
                submissionPercentage: item.submissionPercentage || 0
            }));

        default:
            return data;
    }
};

export const getAssignments = async (backendUrl, role, token) => {
    try {
        const response = await axios.get(`${backendUrl}${role}/assignments`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        return transformData(response.data, role);
    } catch (error) {
        throw error;
    }
};