/**
 * UTSAVO - Authenticated User Workspace & AI Chat Firestore Sync
 * Persists user profiles, bookmarked venues/vendors, and Gemini AI conversation history
 * cleanly under `/users/{uid}` following hardened rules and explicit error boundaries.
 */

import { User } from 'firebase/auth';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  Unsubscribe,
} from 'firebase/firestore';
import { auth, db, handleFirestoreError, OperationType } from './config';

export interface PersistedAiChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  modelUsed?: string;
  sources?: Array<{ title: string; uri: string }>;
  places?: Array<{ title: string; uri: string }>;
}

export interface PersistedAiChatSession {
  id: string;
  uid: string;
  title: string;
  rolePreset: string;
  modelTier: 'FAST' | 'GENERAL' | 'DEEP';
  messages: PersistedAiChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface PersistedWorkspacePreferences {
  uid: string;
  savedVenueIds: string[];
  savedVendorIds: string[];
  preferredLanguage?: 'en' | 'ne';
  updatedAt: string;
}

function sanitizeIdList(ids: string[]): string[] {
  return Array.from(new Set(ids.map((id) => String(id).trim()).filter((id) => id.length > 0 && id.length <= 128))).slice(0, 100);
}

export async function syncAuthenticatedUserProfile(user: User): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== user.uid) return;
  const userDocPath = `users/${user.uid}`;
  const ref = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(ref);
    const email = (user.email || 'user@utsavo.com').slice(0, 100);
    const displayName = (user.displayName || email.split('@')[0] || 'UTSAVO Member').slice(0, 100);

    if (snap.exists()) {
      const existing = snap.data();
      await setDoc(ref, {
        uid: user.uid,
        email,
        name: displayName,
        role: existing.role || 'CUSTOMER',
        createdAt: existing.createdAt || new Date().toISOString(),
      });
    } else {
      await setDoc(ref, {
        uid: user.uid,
        email,
        name: displayName,
        role: 'CUSTOMER',
        createdAt: new Date().toISOString(),
      });
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, userDocPath);
  }
}

export function subscribeUserWorkspacePreferences(
  uid: string,
  onData: (prefs: PersistedWorkspacePreferences | null) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  if (!auth.currentUser || auth.currentUser.uid !== uid) {
    return () => {};
  }
  const docPath = `users/${uid}/workspace/preferences`;
  const ref = doc(db, 'users', uid, 'workspace', 'preferences');
  return onSnapshot(
    ref,
    (snapshot) => {
      if (!snapshot.exists()) {
        onData(null);
        return;
      }
      const data = snapshot.data() as PersistedWorkspacePreferences;
      onData({
        uid: data.uid,
        savedVenueIds: Array.isArray(data.savedVenueIds) ? data.savedVenueIds : [],
        savedVendorIds: Array.isArray(data.savedVendorIds) ? data.savedVendorIds : [],
        preferredLanguage: data.preferredLanguage,
        updatedAt: data.updatedAt,
      });
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.GET, docPath);
      } catch (wrapped) {
        onError?.(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function saveUserWorkspacePreferences(
  uid: string,
  savedVenueIds: string[],
  savedVendorIds: string[],
  preferredLanguage?: 'en' | 'ne'
): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== uid) return;
  const docPath = `users/${uid}/workspace/preferences`;
  const ref = doc(db, 'users', uid, 'workspace', 'preferences');
  const payload: PersistedWorkspacePreferences = {
    uid,
    savedVenueIds: sanitizeIdList(savedVenueIds),
    savedVendorIds: sanitizeIdList(savedVendorIds),
    ...(preferredLanguage ? { preferredLanguage } : {}),
    updatedAt: new Date().toISOString(),
  };
  try {
    await setDoc(ref, payload);
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export function subscribeUserChatSessions(
  uid: string,
  onSessions: (sessions: PersistedAiChatSession[]) => void,
  onError?: (err: Error) => void
): Unsubscribe {
  if (!auth.currentUser || auth.currentUser.uid !== uid) {
    return () => {};
  }
  const colPath = `users/${uid}/chatSessions`;
  const q = query(
    collection(db, 'users', uid, 'chatSessions'),
    orderBy('updatedAt', 'desc'),
    limit(20)
  );
  return onSnapshot(
    q,
    (snapshot) => {
      const list: PersistedAiChatSession[] = snapshot.docs.map((d) => {
        const data = d.data();
        return {
          id: d.id,
          uid: String(data.uid || uid),
          title: String(data.title || 'Celebration Chat'),
          rolePreset: String(data.rolePreset || 'EVENT_PLANNER'),
          modelTier:
            data.modelTier === 'FAST' || data.modelTier === 'DEEP' ? data.modelTier : 'GENERAL',
          messages: Array.isArray(data.messages) ? data.messages : [],
          createdAt: String(data.createdAt || new Date().toISOString()),
          updatedAt: String(data.updatedAt || new Date().toISOString()),
        };
      });
      onSessions(list);
    },
    (error) => {
      try {
        handleFirestoreError(error, OperationType.LIST, colPath);
      } catch (wrapped) {
        onError?.(wrapped instanceof Error ? wrapped : new Error(String(wrapped)));
      }
    }
  );
}

export async function saveUserChatSession(session: PersistedAiChatSession): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== session.uid) return;
  const safeId = session.id.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const docPath = `users/${session.uid}/chatSessions/${safeId}`;
  const ref = doc(db, 'users', session.uid, 'chatSessions', safeId);

  const safeMessages = session.messages.slice(-100).map((m) => ({
    id: String(m.id).slice(0, 64),
    role: m.role === 'user' ? 'user' : 'assistant',
    text: String(m.text || '').slice(0, 6000),
    timestamp: String(m.timestamp || '').slice(0, 32),
    ...(m.modelUsed ? { modelUsed: String(m.modelUsed).slice(0, 64) } : {}),
    ...(Array.isArray(m.sources) ? { sources: m.sources.slice(0, 8) } : {}),
    ...(Array.isArray(m.places) ? { places: m.places.slice(0, 8) } : {}),
  }));

  try {
    await setDoc(ref, {
      uid: session.uid,
      title: String(session.title || 'Celebration Chat').slice(0, 160),
      rolePreset: String(session.rolePreset || 'EVENT_PLANNER').slice(0, 60),
      modelTier: session.modelTier,
      messages: safeMessages,
      createdAt: String(session.createdAt || new Date().toISOString()).slice(0, 64),
      updatedAt: String(session.updatedAt || new Date().toISOString()).slice(0, 64),
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, docPath);
  }
}

export async function deleteUserChatSession(uid: string, sessionId: string): Promise<void> {
  if (!auth.currentUser || auth.currentUser.uid !== uid) return;
  const safeId = sessionId.replace(/[^a-zA-Z0-9_-]/g, '_').slice(0, 128);
  const docPath = `users/${uid}/chatSessions/${safeId}`;
  try {
    await deleteDoc(doc(db, 'users', uid, 'chatSessions', safeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, docPath);
  }
}
