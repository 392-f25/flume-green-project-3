import { Timestamp } from 'firebase/firestore';

export interface EagleProject {
  id: string;
  name: string;
  description: string;
  date: Timestamp | string;
  creator_id?: string;
  parent_volunteers?: number;
  student_volunteers?: number;
  volunteer_hours?: number;
  registered_volunteers?: Record<string, 'scout' | 'parent'>;
  participated?: string[];
  attendance?: string[];
}

export interface TimeRequestStatus {
  requestId: string;
  status: 'pending' | 'approved';
}

export interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  submittedHours?: number;
  timeRequestId?: string;
  role?: 'scout' | 'parent';
}

