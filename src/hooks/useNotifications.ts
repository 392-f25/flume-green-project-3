import { useCallback, useEffect, useState } from 'react';
import { collection, doc, onSnapshot, orderBy, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { NotificationItem } from '../types/notifications';

export const useNotifications = (currentUser: { uid: string } | null) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  useEffect(() => {
    if (!currentUser) {
      setNotifications([]);
      return;
    }

    const notificationsQuery = query(
      collection(db, 'Notifications'),
      where('userId', '==', currentUser.uid),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(notificationsQuery, (snapshot) => {
      const items: NotificationItem[] = snapshot.docs.map((docSnap) => {
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
    });

    return () => unsubscribe();
  }, [currentUser]);

  const markNotificationRead = useCallback(async (notificationId: string) => {
    await updateDoc(doc(db, 'Notifications', notificationId), { read: true });
  }, []);

  const markAllNotificationsRead = useCallback(async () => {
    const unread = notifications.filter((item) => !item.read);
    await Promise.all(unread.map((item) => updateDoc(doc(db, 'Notifications', item.id), { read: true })));
  }, [notifications]);

  const unreadCount = notifications.filter((item) => !item.read).length;

  return {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
  };
};


