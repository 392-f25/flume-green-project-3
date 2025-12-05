import { useEffect, useState } from 'react';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { TimeRequestStatus } from '../types/projects';

export const useUserTimeRequests = (currentUser: { uid: string } | null) => {
  const [userTimeRequests, setUserTimeRequests] = useState<Record<string, TimeRequestStatus>>({});

  useEffect(() => {
    if (!currentUser) {
      setUserTimeRequests({});
      return;
    }

    const requestsQuery = query(
      collection(db, 'TimeRequests'),
      where('requestor', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(requestsQuery, (snapshot) => {
      const statusMap: Record<string, TimeRequestStatus> = {};
      snapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const projectId = data.project_id;
        if (!projectId) return;
        const status: TimeRequestStatus = {
          requestId: docSnap.id,
          status: data.approved ? 'approved' : 'pending',
          hours: typeof data.length_hours === 'number' ? data.length_hours : undefined,
          submittedAt: data.date
        };
        const existing = statusMap[projectId];
        if (!existing || (status.status === 'approved' && existing.status !== 'approved')) {
          statusMap[projectId] = status;
        }
      });
      setUserTimeRequests(statusMap);
    });

    return () => unsubscribe();
  }, [currentUser]);

  return userTimeRequests;
};

