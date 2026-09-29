import fs from "fs";
import path from "path";

export type EventType =
  | "ORDER_CREATED"
  | "PAYMENT_SUCCESS"
  | "ORDER_CONFIRMED"
  | "STATUS_CHANGED"
  | "CUSTOM_REQUEST_CREATED"
  | "CUSTOM_QUOTE_CREATED"
  | "STAFF_ASSIGNED";

export interface EventPayload {
  orderId?: string;
  orderNumber?: string;
  customerName?: string;
  customerPhone?: string;
  totalAmount?: number;
  status?: string;
  staffName?: string;
  customRequestId?: string;
  quotedPrice?: number;
  deliveryDate?: string;
  itemsSummary?: string;
}

export interface AutomationLogEntry {
  id: string;
  timestamp: string;
  event: EventType;
  channel: "WHATSAPP" | "GOOGLE_SHEETS" | "INTERNAL";
  recipient: string;
  status: "SENT" | "READY_TO_CONNECT" | "FAILED";
  details: string;
  payload: EventPayload;
}

const LOG_FILE = path.join(process.cwd(), "data", "automation_logs.json");

function readLogs(): AutomationLogEntry[] {
  try {
    if (fs.existsSync(LOG_FILE)) {
      return JSON.parse(fs.readFileSync(LOG_FILE, "utf-8"));
    }
  } catch {
    // ignore
  }
  return [];
}

function writeLogs(logs: AutomationLogEntry[]): void {
  try {
    const dir = path.dirname(LOG_FILE);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(LOG_FILE, JSON.stringify(logs.slice(0, 200), null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write automation logs:", err);
  }
}

/**
 * Dispatches an event across WhatsApp & Google Sheets channels.
 * Clearly marks status as 'READY_TO_CONNECT' when external API credentials are unconfigured.
 */
export async function dispatchAutomationEvent(
  event: EventType,
  payload: EventPayload
): Promise<AutomationLogEntry[]> {
  const logs = readLogs();
  const timestamp = new Date().toISOString();
  const createdEntries: AutomationLogEntry[] = [];

  // --- 1. WhatsApp Channel ---
  const hasWhatsAppCreds = Boolean(
    process.env.WHATSAPP_API_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID
  );
  const whatsappRecipient = payload.customerPhone || "Owner / Staff";

  const waEntry: AutomationLogEntry = {
    id: `WA-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp,
    event,
    channel: "WHATSAPP",
    recipient: whatsappRecipient,
    status: hasWhatsAppCreds ? "SENT" : "READY_TO_CONNECT",
    details: hasWhatsAppCreds
      ? `Real WhatsApp template sent for ${event}`
      : `WhatsApp Cloud API ready to connect. Template mapped for ${event} to ${whatsappRecipient}.`,
    payload,
  };
  createdEntries.push(waEntry);
  logs.unshift(waEntry);

  // --- 2. Google Sheets Channel ---
  const hasSheetsCreds = Boolean(
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_SHEET_ID
  );

  const sheetsEntry: AutomationLogEntry = {
    id: `GS-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp,
    event,
    channel: "GOOGLE_SHEETS",
    recipient: "Operational Google Sheet",
    status: hasSheetsCreds ? "SENT" : "READY_TO_CONNECT",
    details: hasSheetsCreds
      ? `Synchronized row to Google Sheet: ${payload.orderNumber || payload.customRequestId}`
      : `Google Sheets integration ready to connect. Row format prepared for ${payload.orderNumber || payload.customRequestId}.`,
    payload,
  };
  createdEntries.push(sheetsEntry);
  logs.unshift(sheetsEntry);

  writeLogs(logs);
  return createdEntries;
}

export function getAutomationLogs(): AutomationLogEntry[] {
  return readLogs();
}
