import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, onSnapshot, addDoc, updateDoc, doc, serverTimestamp, query, where,orderBy } from "firebase/firestore";
import { db } from "../DataAcess/firebase";
import { dbSetting } from "../DataAcess/dbSetting";

// Fetch Income Types with Real-Time Updates
export const subscribeToIncomeTypes = () => (dispatch) => {
  const userId = localStorage.getItem('userId');
  if (!userId) return;

  const incomeTypesQuery = query(
    collection(db, dbSetting.IncomeTypeTable),
    where("userId", "==", userId),
    orderBy("createdOn")
  );

  return onSnapshot(incomeTypesQuery, (snapshot) => {
    const incomeTypes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdOn: doc.data().createdOn?.toDate().toISOString() || null,
      updatedOn: doc.data().updatedOn?.toDate().toISOString() || null,
    }));

    dispatch(setIncomeTypes(incomeTypes)); // Update Redux state
  });
};

// Add New Income Type
export const addIncomeType = createAsyncThunk(
  "incomeTypes/addIncomeType", 
  async (_, { rejectWithValue }) => {
    const userId = localStorage.getItem('userId');
    if (!userId) return rejectWithValue("User ID is missing");

    try {
      await addDoc(collection(db, dbSetting.IncomeTypeTable), {
        name: "",
        isActive: true,
        createdOn: serverTimestamp(),
        updatedOn: serverTimestamp(),
        userId: userId,
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Income Type
export const updateIncomeType = createAsyncThunk(
  "incomeTypes/updateIncomeType", 
  async (updatedIncomeType, { rejectWithValue }) => {
    try {
      await updateDoc(doc(db, dbSetting.IncomeTypeTable, updatedIncomeType.id), {
        name: updatedIncomeType.name,
        isActive: updatedIncomeType.isActive ?? true,
        updatedOn: serverTimestamp(),
      });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const incomeTypeSlice = createSlice({
  name: "incomeTypes",
  initialState: { data: [], loading: false, error: null },
  reducers: {
    setIncomeTypes: (state, action) => {
      state.data = action.payload; // Update Redux state when Firestore changes
    },
  },
});

export const { setIncomeTypes } = incomeTypeSlice.actions;
export default incomeTypeSlice.reducer;
