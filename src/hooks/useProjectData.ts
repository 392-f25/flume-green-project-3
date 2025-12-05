import { useCallback, useEffect, useState } from 'react';
import { collection, doc, onSnapshot, query, updateDoc, where, deleteField, Timestamp, deleteDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { EagleProject, TimeRequestStatus, Volunteer } from '../types/projects';
import { useUserTimeRequests } from './useUserTimeRequests';
import { useEventVolunteers } from './useEventVolunteers';

interface UseProjectDataArgs {
  currentUser: { uid: string } | null;
}

interface UseProjectDataResult {
  events: EagleProject[];
  eventVolunteers: Volunteer[];
  userTimeRequests: Record<string, TimeRequestStatus>;
  selectedEventId: string | null;
  editingEvent: EagleProject | null;
  setSelectedEventId: (id: string | null) => void;
  setEditingEvent: (event: EagleProject | null) => void;
  registerForEvent: (eventId: string, role: 'scout' | 'parent') => Promise<void>;
  unregisterFromEvent: (eventId: string) => Promise<void>;
  approveVolunteerHours: (volunteerId: string, timeRequestId: string | undefined, isApproved: boolean) => Promise<void>;
  editVolunteerHours: (volunteerId: string, timeRequestId: string, newHours: number) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;
}

export function useProjectData({ currentUser }: UseProjectDataArgs): UseProjectDataResult {
  const [events, setEvents] = useState<EagleProject[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<EagleProject | null>(null);
  const userTimeRequests = useUserTimeRequests(currentUser);
  const { eventVolunteers, setEventVolunteers } = useEventVolunteers({ selectedEventId, events, currentUser });

  useEffect(() => {
    if (!currentUser) return;
    const unsubscribe = onSnapshot(query(collection(db, 'Project')), (snapshot) => {
      const projects = snapshot.docs.map((projectDoc): EagleProject => {
        const data = projectDoc.data();
        const registered = (data.registered_volunteers || {}) as Record<string, unknown>;
        const registeredVolunteers = Object.entries(registered).reduce<Record<string, 'scout' | 'parent'>>((acc, [uid, role]) => {
          if (role === 'scout' || role === 'parent') {
            acc[uid] = role;
          }
          return acc;
        }, {});

        return {
          id: projectDoc.id,
          name: data.name || '',
          description: data.description || '',
          date: data.date || Timestamp.now(),
          creator_id: data.creator_id || '',
          parent_volunteers: data.parent_volunteers || 0,
          student_volunteers: data.student_volunteers || 0,
          volunteer_hours: data.volunteer_hours || 0,
          participated: data.participated || [],
          attendance: data.attendance || [],
          registered_volunteers: registeredVolunteers
        };
      });
      setEvents(projects);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const registerForEvent = useCallback(async (eventId: string, role: 'scout' | 'parent') => {
    if (!currentUser) {
      alert('You must be logged in to register.');
      return;
    }
    await updateDoc(doc(db, 'Project', eventId), {
      [`registered_volunteers.${currentUser.uid}`]: role
    });
  }, [currentUser]);

  const unregisterFromEvent = useCallback(async (eventId: string) => {
    if (!currentUser) {
      alert('You must be logged in to unregister.');
      return;
    }
    await updateDoc(doc(db, 'Project', eventId), {
      [`registered_volunteers.${currentUser.uid}`]: deleteField()
    });
  }, [currentUser]);

  const approveVolunteerHours = useCallback(async (volunteerId: string, timeRequestId: string | undefined, isApproved: boolean) => {
    if (!selectedEventId || !timeRequestId) return;
    const event = events.find((item) => item.id === selectedEventId);
    if (!event) return;
    if (!currentUser || event.creator_id !== currentUser.uid) {
      alert('Only the event creator can approve hours for this event.');
      return;
    }

    const currentAttendance = event.attendance || [];
    const updatedAttendance = isApproved
      ? [...new Set([...currentAttendance, volunteerId])]
      : currentAttendance.filter((id) => id !== volunteerId);

    if (isApproved) {
      await updateDoc(doc(db, 'TimeRequests', timeRequestId), { approved: true });
    }
    await updateDoc(doc(db, 'Project', selectedEventId), { attendance: updatedAttendance });
  }, [currentUser, events, selectedEventId]);

  const editVolunteerHours = useCallback(async (volunteerId: string, timeRequestId: string, newHours: number) => {
    if (!selectedEventId) throw new Error('No event selected.');
    const event = events.find((item) => item.id === selectedEventId);
    if (!event) throw new Error('Event not found.');
    if (!currentUser || event.creator_id !== currentUser.uid) {
      throw new Error('Only the event creator can edit volunteer hours.');
    }
    await updateDoc(doc(db, 'TimeRequests', timeRequestId), { length_hours: newHours });
    setEventVolunteers((prev) => prev.map((volunteer) => volunteer.id === volunteerId ? { ...volunteer, submittedHours: newHours } : volunteer));
  }, [currentUser, events, selectedEventId]);

  const deleteProject = useCallback(async (projectId: string) => {
    if (!currentUser) {
      alert('You must be logged in to delete a project.');
      return;
    }
    const event = events.find((item) => item.id === projectId);
    if (!event) {
      alert('Project not found.');
      return;
    }
    if (event.creator_id !== currentUser.uid) {
      alert('Only the project creator can delete this project.');
      return;
    }
    await deleteDoc(doc(db, 'Project', projectId));
  }, [currentUser, events]);

  return {
    events,
    eventVolunteers,
    userTimeRequests,
    selectedEventId,
    editingEvent,
    setSelectedEventId,
    setEditingEvent,
    registerForEvent,
    unregisterFromEvent,
    approveVolunteerHours,
    editVolunteerHours,
    deleteProject
  };
}

