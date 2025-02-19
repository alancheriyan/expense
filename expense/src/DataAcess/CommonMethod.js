import { signOut } from "firebase/auth";
import { auth } from "../DataAcess/firebase";

export const handleLogout = async (navigate) => { 
  debugger;
  try {
    await signOut(auth);
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    localStorage.removeItem("setupProfile");
    localStorage.removeItem("emailVerified");
    navigate("/login");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};
