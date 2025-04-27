export interface FamilyMember {
  id?: string;
  name: string;
  role: string;
  avatar?: string;
  email?: string;
  phone?: string;
  country?: string; // País para ver días festivos relevantes
}

// Modelo de Evento personalizado
export interface FamilyEvent {
  id?: string;
  title: string;
  description?: string;
  start_date: string;
  end_date?: string;
  assigned_to?: string[];
  created_by?: string;
  priority?: 'high' | 'medium' | 'low';
  is_holiday?: boolean;
  holiday_id?: string;
  created?: string;
}

export type Event = FamilyEvent;
