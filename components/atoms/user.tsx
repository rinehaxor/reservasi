import { atom } from 'jotai';

interface User {
   id: string | null;
   role: number | null;
   email: string | null;
   user_metadata: any;
   app_metadata?: any;
   aud?: string;
   confirmation_sent_at?: string;
   recovery_sent_at?: string;
   last_sign_in_at?: string;
   created_at?: string;
   updated_at?: string;
   factors?: any[];
}

export const userAtom = atom<User>({
   id: null,
   role: null,
   email: null,
   user_metadata: {},
});
