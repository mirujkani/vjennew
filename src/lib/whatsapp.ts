// WhatsApp Business API integration structure
// This provides the structure for WhatsApp integration

export interface WhatsAppMessage {
    to: string;
    type: 'text' | 'template';
    content: string;
}

export interface WhatsAppCallRequest {
    to: string;
    message: string;
}

// Message templates
export const messageTemplates = {
    appointmentConfirmation: (
        clientName: string,
        businessName: string,
        date: string,
        time: string,
        physiotherapist: string
    ) => `
🎉 Appointment Confirmed!

Hello ${clientName},

Your appointment at ${businessName} has been confirmed:

📅 Date: ${date}
⏰ Time: ${time}
👨‍⚕️ Physiotherapist: ${physiotherapist}

If you need to reschedule or cancel, please contact us.

Thank you for choosing ${businessName}!
`.trim(),

    appointmentReminder: (
        clientName: string,
        businessName: string,
        date: string,
        time: string
    ) => `
⏰ Reminder: Upcoming Appointment

Hello ${clientName},

This is a reminder about your appointment tomorrow at ${businessName}:

📅 Date: ${date}
⏰ Time: ${time}

Please arrive 5 minutes early.

See you soon!
`.trim(),

    appointmentCancellation: (
        clientName: string,
        businessName: string,
        date: string,
        time: string
    ) => `
❌ Appointment Cancelled

Hello ${clientName},

Your appointment at ${businessName} has been cancelled:

📅 Date: ${date}
⏰ Time: ${time}

If you'd like to reschedule, please visit our booking page.

Thank you for your understanding.
`.trim(),
};

// Send a WhatsApp message (mock implementation for demo)
export async function sendWhatsAppMessage(
    phoneNumber: string,
    message: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
    // In production, this would call the WhatsApp Business API
    console.log(`[WhatsApp] Sending message to ${phoneNumber}:`, message);

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                messageId: `msg_${Date.now()}`,
            });
        }, 500);
    });
}

// Initiate a WhatsApp voice call (mock implementation for demo)
export async function initiateWhatsAppCall(
    phoneNumber: string,
    voiceMessage: string
): Promise<{ success: boolean; callId?: string; error?: string }> {
    console.log(`[WhatsApp] Initiating call to ${phoneNumber}:`, voiceMessage);

    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                success: true,
                callId: `call_${Date.now()}`,
            });
        }, 1000);
    });
}

// Send appointment confirmation via WhatsApp
export async function sendAppointmentConfirmation(
    phoneNumber: string,
    clientName: string,
    businessName: string,
    date: string,
    time: string,
    physiotherapist: string,
    useVoiceCall: boolean = false
): Promise<{ success: boolean; error?: string }> {
    const message = messageTemplates.appointmentConfirmation(
        clientName,
        businessName,
        date,
        time,
        physiotherapist
    );

    if (useVoiceCall) {
        const callResult = await initiateWhatsAppCall(phoneNumber, message);
        return { success: callResult.success, error: callResult.error };
    } else {
        const msgResult = await sendWhatsAppMessage(phoneNumber, message);
        return { success: msgResult.success, error: msgResult.error };
    }
}

// Format phone number for WhatsApp API
export function formatPhoneNumber(phone: string): string {
    // Remove all non-numeric characters except +
    let cleaned = phone.replace(/[^\d+]/g, '');

    // Ensure it starts with +
    if (!cleaned.startsWith('+')) {
        // Assume Netherlands country code if no prefix
        cleaned = '+31' + cleaned;
    }

    return cleaned;
}
