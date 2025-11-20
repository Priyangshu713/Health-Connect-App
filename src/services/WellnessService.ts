import axios from 'axios';

export interface WellnessEntry {
    entry: string;
    date?: string;
}

export interface WellnessAnalysis {
    analysis: string;
    date: string;
    timestamp: number;
}

export const analyzeWellnessEntry = async (entry: string, date?: string): Promise<WellnessAnalysis> => {
    try {
        const response = await axios.post('/api/analyze-wellness', {
            entry,
            date: date || new Date().toISOString()
        });

        if (response.data && response.data.success) {
            return response.data.data;
        }

        throw new Error('Invalid response from server');
    } catch (error) {
        console.error('Error analyzing wellness entry:', error);
        throw error;
    }
};
