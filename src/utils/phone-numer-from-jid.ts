import { parsePhoneNumberWithError } from "libphonenumber-js";

/**
 * Get phone number from JID
 * @param jid - JID (remote JID)
 */
export function phoneNumberFromJid(jid: string) {
  return parsePhoneNumberWithError(`+${jid.split("@")[0]}`).number;
}
