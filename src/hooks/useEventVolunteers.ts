import { useEffect, useState } from 'react';
import { collection, doc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { EagleProject, Volunteer } from '../types/projects';

interface UseEventVolunteersArgs {
  selectedEventId: string | null;
  events: EagleProject[];
  currentUser: { uid: string; displayName?: string | null; email?: string | null } | null;
}

export const useEventVolunteers = ({ selectedEventId, events, currentUser }: UseEventVolunteersArgs) => {
  const [eventVolunteers, setEventVolunteers] = useState<Volunteer[]>([]);

  useEffect(() => {
    const loadVolunteers = async () => {
      if (!selectedEventId) {
        setEventVolunteers([]);
        return;
      }
      const event = events.find((item) => item.id === selectedEventId);
      if (!event || !event.registered_volunteers || Object.keys(event.registered_volunteers).length === 0) {
        setEventVolunteers([]);
        return;
      }

      const volunteers: Volunteer[] = [];
      for (const uid of Object.keys(event.registered_volunteers)) {
        try {
          const userDocSnap = await getDoc(doc(db, 'Users', uid));
          const requestSnapshot = await getDocs(query(
            collection(db, 'TimeRequests'),
            where('requestor', '==', uid),
            where('project_id', '==', selectedEventId)
          ));

          let submittedHours: number | undefined;
          let timeRequestId: string | undefined;
          if (!requestSnapshot.empty) {
            const pendingRequest = requestSnapshot.docs.find((docSnapshot) => docSnapshot.data().approved === false);
            const approvedRequest = requestSnapshot.docs.find((docSnapshot) => docSnapshot.data().approved === true);
            const selectedDoc = pendingRequest || approvedRequest || requestSnapshot.docs[0];
            if (selectedDoc) {
              const requestData = selectedDoc.data();
              if (typeof requestData.length_hours === 'number') {
                submittedHours = requestData.length_hours;
              }
              timeRequestId = selectedDoc.id;
            }
          }

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            volunteers.push({
              id: uid,
              firstName: userData.firstName || userData.first_name || 'Unknown',
              lastName: userData.lastName || userData.last_name || '',
              email: userData.email || 'N/A',
              submittedHours,
              timeRequestId,
              role: event.registered_volunteers[uid] as 'scout' | 'parent'
            });
          } else if (currentUser && currentUser.uid === uid) {
            const displayName = currentUser.displayName || 'User';
            const nameParts = displayName.split(' ');
            volunteers.push({
              id: uid,
              firstName: nameParts[0] || 'User',
              lastName: nameParts.slice(1).join(' ') || '',
              email: currentUser.email || 'N/A',
              submittedHours,
              timeRequestId,
              role: event.registered_volunteers[uid] as 'scout' | 'parent'
            });
          } else {
            volunteers.push({
              id: uid,
              firstName: 'Unknown',
              lastName: 'User',
              email: 'Not available',
              submittedHours,
              timeRequestId,
              role: event.registered_volunteers[uid] as 'scout' | 'parent'
            });
          }
        } catch (error) {
          console.error(`Error fetching user ${uid}:`, error);
          volunteers.push({
            id: uid,
            firstName: 'Unknown',
            lastName: 'User',
            email: 'Not available',
            role: event.registered_volunteers[uid] as 'scout' | 'parent'
          });
        }
      }
      setEventVolunteers(volunteers);
    };

    loadVolunteers();
  }, [selectedEventId, events, currentUser]);

  return { eventVolunteers, setEventVolunteers };
};

