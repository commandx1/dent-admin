import api from '@/lib/api';

export interface AppointmentStatistics {
  totalScheduleAppointments: number;
  completedScheduleAppointments: number;
  pendingScheduleAppointments: number;
  cancelledScheduleAppointments: number;
  totalEmergencyCallAppointments: number;
  completedEmergencyCallAppointments: number;
  expiredEmergencyCallAppointments: number;
  cancelledEmergencyCallAppointments: number;
  averageResponseTimeMinutes: number;
  totalRemoteAssistanceAppointments: number;
  completedRemoteAssistanceAppointments: number;
  averageDurationMinutes: number;
}

export interface ScheduledAppointment {
  appointmentId: string;
  description: string;
  createdAt: string;
  scheduledDate: string;
  scheduledTime: string;
  organizerName: string;
  serviceProviderName: string;
  serviceProviderId: string;
  locationAddress: string;
  appointmentStatus: 'PENDING' | 'APPROVED' | 'COMPLETED';
}

export interface IncompleteAppointment {
  appointmentId: string;
  organizerName: string;
  serviceProviderName: string;
  locationAddress: string;
  appointmentStatus: string;
  appointmentType: string;
  description: string | null;
  scheduleDate: string | null;
  scheduleTime: string | null;
  workStartDatetime: string;
  workFinishDatetime: string;
  createdAt: string;
  updatedAt: string;
}

export interface IncompleteAppointmentResponse {
  content: IncompleteAppointment[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface ScheduledAppointmentResponse {
  content: ScheduledAppointment[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export const appointmentService = {
  getStatistics: async () => {
    const response = await api.get<AppointmentStatistics>('/api/v1/appointments/statistics');
    return response.data;
  },

  getScheduled: async (page = 0, size = 10, daysFromNow = 7, sortDirection = 'ASC') => {
    const response = await api.get<ScheduledAppointmentResponse>('/api/v1/appointments/scheduled', {
      params: {
        page,
        size,
        daysFromNow,
        sortDirection,
      },
    });
    return response.data;
  },

  getIncomplete: async (page = 0, size = 10, searchTerm = '', sortBy = 'schedule_date', sortDirection = 'DESC') => {
    const response = await api.get<IncompleteAppointmentResponse>('/api/v1/appointments/incompleted', {
      params: {
        page,
        size,
        searchTerm,
        sortBy,
        sortDirection,
      },
    });
    return response.data;
  },

  markNotCompleted: async (appointmentId: string) => {
    const response = await api.patch(`/api/v1/appointments/${appointmentId}/mark-not-completed`);
    return response.data;
  },

  changeTechnician: async (appointmentId: string, newTechnicianId: string) => {
    const response = await api.put('/api/v1/appointments/change-technician', {
      appointmentId,
      newTechnicianId,
    });
    return response.data;
  },
};
