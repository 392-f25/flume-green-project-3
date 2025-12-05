import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { Volunteer } from '../types/projects';

interface NotificationOptions {
  eventId?: string;
  eventName?: string;
  eventDate?: any;
  eventDescription?: string;
  senderId?: string;
  senderName?: string;
}

interface EmailMessage {
  to: string;
  subject: string;
  body: string;
}

/**
 * Creates an email message for a volunteer
 */
const createEmailMessage = (
  volunteer: Volunteer,
  options?: NotificationOptions
): EmailMessage => {
  const { firstName, lastName, email } = volunteer;
  
  // Format event date if provided
  let formattedDate = '';
  if (options?.eventDate) {
    try {
      const date = typeof options.eventDate?.toDate === 'function'
        ? options.eventDate.toDate()
        : new Date(options.eventDate);
      formattedDate = date.toLocaleString();
    } catch (error) {
      console.warn('Error formatting event date:', error);
    }
  }

  // Build subject line
  const subject = options?.eventName
    ? `Reminder: Submit Your Hours for ${options.eventName}`
    : 'Reminder: Submit Your Volunteer Hours';

  // Build email body
  const recipientName = `${firstName}${lastName ? ` ${lastName}` : ''}`;
  let body = `Dear ${recipientName},\n\n`;
  
  if (options?.eventName) {
    body += `This is a reminder to submit your volunteer hours for the event: ${options.eventName}.\n\n`;
  } else {
    body += `This is a reminder to submit your volunteer hours.\n\n`;
  }

  if (formattedDate) {
    body += `Event Date: ${formattedDate}\n`;
  }

  if (options?.eventDescription) {
    body += `\nEvent Description: ${options.eventDescription}\n`;
  }

  body += `\nPlease log in to the volunteer portal to submit your hours.\n\n`;
  body += `Thank you for your service!\n\n`;
  body += `Best regards,\nVolunteer Management Team`;

  return {
    to: email,
    subject,
    body,
  };
};

/**
 * Creates email messages for each volunteer and console logs them
 */
export const notifyVolunteers = async (
  volunteers: Volunteer[],
  options?: NotificationOptions
): Promise<void> => {
  if (volunteers.length === 0) {
    console.log('No volunteers to notify.');
    return;
  }

  console.log(`\n=== Generating ${volunteers.length} email notification(s) ===\n`);

  const notificationsRef = collection(db, 'Notifications');

  await Promise.all(volunteers.map(async (volunteer, index) => {
    // Skip notifying the sender themselves if provided
    if (options?.senderId && volunteer.id === options.senderId) {
      return;
    }

    const emailMessage = createEmailMessage(volunteer, options);

    console.log(`Email ${index + 1}:`);
    console.log(`To: ${emailMessage.to}`);
    console.log(`Subject: ${emailMessage.subject}`);
    console.log(`Body:\n${emailMessage.body}`);
    console.log('\n---\n');

    try {
      await addDoc(notificationsRef, {
        userId: volunteer.id,
        title: emailMessage.subject,
        body: emailMessage.body,
        eventId: options?.eventId || null,
        eventName: options?.eventName || null,
        senderId: options?.senderId || null,
        createdAt: serverTimestamp(),
        read: false,
      });
    } catch (error) {
      console.error('Error creating notification for', volunteer.id, error);
    }
  }));

  console.log(`=== Finished generating ${volunteers.length} email notification(s) ===\n`);
};

