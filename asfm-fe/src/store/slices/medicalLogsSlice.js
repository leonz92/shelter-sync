import { fetchMedicalLogs as fetchMedicalLogsFromAPI } from '@/services/medicalLogsService';

export const medicalLogsSlice = (set, get) => ({
  medicalLogs: [],
  medicalLogsLoading: false,
  medicalLogsError: null,
  medicalLogsFetched: false,

  fetchMedicalLogs: async () => {
    const { medicalLogsLoading, medicalLogsFetched } = get();
    if (medicalLogsFetched || medicalLogsLoading) return;

    set((state) => {
      state.medicalLogsLoading = true;
      state.medicalLogsError = null;
    });

    try {
      const data = await fetchMedicalLogsFromAPI();
      const animals = get().animals;

      // Enrich medical logs with animal names
      const enrichedData = data.map((log) => {
        const animal = animals.find((a) => a.id === log.animal_id);
        return {
          ...log,
          animal_name: animal?.name || 'Unknown Animal',
        };
      });

      set((state) => {
        state.medicalLogs = enrichedData;
        state.medicalLogsLoading = false;
        state.medicalLogsFetched = true;
      });
    } catch (error) {
      set((state) => {
        state.medicalLogsError = 'Failed to load medical logs. Please try again.';
        state.medicalLogsLoading = false;
      });
    }
  },

  addMedicalLog: (log) =>
    set((state) => {
      const animals = get().animals;
      const animal = animals.find((a) => a.id === log.animal_id);
      state.medicalLogs.push({
        ...log,
        animal_name: animal?.name || 'Unknown Animal',
      });
    }),
});