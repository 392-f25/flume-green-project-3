import { useCallback, useEffect, useState } from 'react';
import { collection, doc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { NotificationItem } from '../types/notifications';

export const useNotifications = (userId: string | null) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!userId) {
      setNotifications([]);
      return;
    }

    const baseQuery = query(
      collection(db, 'Notifications'),
      where('userId', '==', userId)
    );
    const orderedQuery = query(baseQuery, orderBy('createdAt', 'desc'));

    const handleSnapshot = (snapshot: any) => {
      const items: NotificationItem[] = snapshot.docs.map((docSnap: any) => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          title: data.title || 'Notification',
          body: data.body || '',
          eventId: data.eventId || undefined,
          eventName: data.eventName || undefined,
          read: Boolean(data.read),
          createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : undefined,
        };
      });
      setNotifications(items);
    };

    // Try ordered query first; if index is missing, fall back to unordered so UI still works.
    let unsubscribe = onSnapshot(
      orderedQuery,
      handleSnapshot,
      (error) => {
        if (error?.code === 'failed-precondition') {
          console.warn('Notifications ordered query missing index; falling back without order. Create a composite index on userId ASC, createdAt DESC in Firestore to enable ordering.');
          unsubscribe = onSnapshot(baseQuery, handleSnapshot);
        } else {
          console.error('Error fetching notifications:', error);
        }
      }
    );

    return () => unsubscribe && unsubscribe();
  }, [userId]);

  const markNotificationRead = useCallback(async (notificationId: string) => {
    if (!userId) return;
    await updateDoc(doc(db, 'Notifications', notificationId), { read: true });
  }, [userId]);

  const markAllNotificationsRead = useCallback(async () => {
    if (!userId) return;
    const unread = notifications.filter((item) => !item.read);
    await Promise.all(unread.map((item) => updateDoc(doc(db, 'Notifications', item.id), { read: true })));
  }, [notifications, userId]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  return {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
  };
};


