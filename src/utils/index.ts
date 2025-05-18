import { v4 as uuidv4 } from "uuid";

export const getRandomOrTimestampedUUID = ():string => {
    try {
        return crypto.randomUUID()
    } catch (error) {
        const newUuid = uuidv4();
        const cleanUuid = newUuid.replace(/-/g, "");
        return `${new Date().getTime()}_${parseInt(cleanUuid.slice(0, 6), 16)}`;
    }
  };

  export const getNewUUID = ():string =>{
    const UUID = crypto.randomUUID();
    return UUID ? UUID : uuidv4()
  }

  // lib/utils.ts
type ClassValue = string | boolean | null | undefined;

export function cn(...classes: ClassValue[]): string {
  return classes.filter(Boolean).join(' ');
}

export const sendEmail = async (tutorEmail: string, studentEmail: string, subject: string, zoomLink: string):Promise<boolean> => {
  try {
    const response  = await fetch("/.netlify/functions/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ tutorEmail, studentEmail, subject, zoomLink }),
    });
    return !!response.ok
  } catch (error) {
    
    return false
  }
  
};


