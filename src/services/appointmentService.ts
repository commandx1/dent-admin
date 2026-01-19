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
  locationAddress: string;
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
};
