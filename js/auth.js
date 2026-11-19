import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword,
  sendEmailVerification, signOut, onAuthStateChanged, updateProfile
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getFirestore, doc, setDoc, getDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { firebaseConfig } from "./firebase-config.js";
import { AVATARS } from "./avatars.js";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

// ── REGISTER ──
export async function registerUser(name, email, password, avatarNumber) {
  const avatar = Number(avatarNumber);
  const cred = await createUserWithEmailAndPassword(auth, email, password);
  // updateProfile must complete before sendEmailVerification
  await updateProfile(cred.user, {
    displayName: name,
    photoURL: String(avatar)
  });
  await sendEmailVerification(cred.user);
  await setDoc(doc(db, "users", cred.user.uid), {
    name,
    email,
    avatar,
    role: "student",
    emailVerified: false,
    createdAt: serverTimestamp()
  });
  return cred.user;
}

// ── LOGIN ──
export async function loginUser(email, password) {
  const cred = await signInWithEmailAndPassword(auth, email, password);
  if (!cred.user.emailVerified) {
    await signOut(auth);
    throw { code: "auth/email-not-verified" };
  }
  const profile = await getUserProfile(cred.user.uid);
  const avatar = getAvatarNumber(profile);
  await setDoc(doc(db, "users", cred.user.uid), {
    emailVerified: true,
    ...(avatar ? { avatar } : {})
  }, { merge: true });
  sessionStorage.setItem("cat_user", JSON.stringify({
    initial: (cred.user.displayName || cred.user.email)[0].toUpperCase(),
    avatar
  }));
  return cred.user;
}

// ── LOGOUT ──
export async function logoutUser() {
  sessionStorage.removeItem("cat_user");
  await signOut(auth);
  window.location.href = "/index.html";
}

// ── GET USER PROFILE ──
export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, "users", uid));
  return snap.exists() ? snap.data() : null;
}

function validAvatar(avatar) {
  return Number.isInteger(avatar) && avatar >= 1 && avatar <= AVATARS.length;
}

function getAvatarNumber(profile) {
  if (validAvatar(profile?.avatar)) return profile.avatar;
  return Number.isInteger(profile?.avatarIndex) && profile.avatarIndex >= 0 && profile.avatarIndex < AVATARS.length
    ? profile.avatarIndex + 1
    : null;
}

// ── AUTH GUARD (student pages) ──
export function requireAuth(redirectTo = "/auth/login.html") {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, (user) => {
      unsub();
      if (!user || !user.emailVerified) {
        window.location.href = redirectTo;
      } else {
        resolve(user);
      }
    });
  });
}

// ── AUTH GUARD (admin pages) ──
export function requireAdmin() {
  return new Promise((resolve) => {
    const unsub = onAuthStateChanged(auth, async (user) => {
      unsub();
      if (!user) { window.location.href = "/admin/login.html"; return; }
      const profile = await getUserProfile(user.uid);
      if (!profile || profile.role !== "admin") {
        window.location.href = "/index.html"; return;
      }
      resolve({ user, profile });
    });
  });
}

// ── POPULATE NAV USER STATE ──
export function initNavAuth() {
  const guestEl = document.getElementById("nav-guest");
  const userEl = document.getElementById("nav-user");
  const initialEl = document.getElementById("user-initial");

  function showGuest() {
    if (guestEl) { guestEl.classList.add("nav-ready"); guestEl.style.display = ""; }
    if (userEl) { userEl.classList.remove("nav-ready"); userEl.style.display = ""; }
  }
  function showUser(initial, avatar) {
    if (guestEl) { guestEl.classList.remove("nav-ready"); guestEl.style.display = ""; }
    if (userEl) { userEl.classList.add("nav-ready"); userEl.style.display = ""; }
    if (initialEl) {
      if (validAvatar(avatar)) {
        initialEl.textContent = AVATARS[avatar - 1].emoji;
        initialEl.classList.add("user-avatar-emoji");
        initialEl.setAttribute("aria-label", `${AVATARS[avatar - 1].label} avatar`);
      } else {
        initialEl.textContent = initial;
        initialEl.classList.remove("user-avatar-emoji");
        initialEl.removeAttribute("aria-label");
      }
    }
  }

  // Apply cached state instantly — no flash
  const cached = sessionStorage.getItem("cat_user");
  if (cached) {
    try {
      const { initial, avatar } = JSON.parse(cached);
      showUser(initial, avatar);
    } catch(_) { showGuest(); }
  } else {
    showGuest();
  }

  // Firebase confirms and corrects if needed
  onAuthStateChanged(auth, async (user) => {
    if (!user || !user.emailVerified) {
      sessionStorage.removeItem("cat_user");
      showGuest();
    } else {
      const initial = (user.displayName || user.email)[0].toUpperCase();
      const profile = await getUserProfile(user.uid);
      if (auth.currentUser?.uid !== user.uid) return;
      const avatar = getAvatarNumber(profile);
      sessionStorage.setItem("cat_user", JSON.stringify({ initial, avatar }));
      showUser(initial, avatar);
    }
  });
}

export { onAuthStateChanged };
