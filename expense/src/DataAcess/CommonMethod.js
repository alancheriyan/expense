import { signOut } from "firebase/auth";
import { auth } from "../DataAcess/firebase";

export const handleLogout = async (navigate) => { 
  try {
    await signOut(auth);
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("setupProfile");
    localStorage.removeItem("emailVerified");
    localStorage.removeItem("userInfo");
    navigate("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};


export const getFormatedDate = (date) => {
  const inputDate = new Date(date);
  const now = new Date();

  const isToday = inputDate.toDateString() === now.toDateString();
  const yesterday = new Date();
  yesterday.setDate(now.getDate() - 1);
  const isYesterday = inputDate.toDateString() === yesterday.toDateString();

  const timeString = inputDate.toLocaleString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).replace(" AM", "am").replace(" PM", "pm");

  if (isToday) return `Today, ${timeString}`;
  if (isYesterday) return `Yesterday, ${timeString}`;

  return inputDate.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).replace(",", "").replace(" AM", "am").replace(" PM", "pm");
};