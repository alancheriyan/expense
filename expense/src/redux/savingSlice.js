import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../DataAcess/firebase";
import { dbSetting } from "../DataAcess/dbSetting";

// Subscribe to real-time updates for Savings
export const subscribeToSavings = () => (dispatch) => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;
  const savingsQuery = query(
    collection(db, dbSetting.SavingTable),
    where("userId", "==", userId),
    where("isActive", "==", true),
    orderBy("createdOn")
  );

  return onSnapshot(savingsQuery, (snapshot) => {
    const savings = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdOn: doc.data().createdOn?.toDate().toISOString() || null,
      updatedOn: doc.data().updatedOn?.toDate().toISOString() || null,
    }));
    dispatch(setSavings(savings));
  });
};

// Add New Saving Goal
export const addSaving = createAsyncThunk(
  "savings/addSaving",
  async ({ value = "", amount = 0 } = {}, { rejectWithValue }) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return rejectWithValue("User ID is missing from localStorage");

    try {
      const newDocRef = await addDoc(collection(db, dbSetting.SavingTable), {
        name: value, // Defaults to "" if not provided
        amount,
        isActive: true,
        createdOn: serverTimestamp(),
        updatedOn: serverTimestamp(),
        userId,
      });

      return { id: newDocRef.id, name: value, amount, isActive: true, userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Saving Goal
export const updateSaving = createAsyncThunk(
  "savings/updateSaving",
  async ({ id, field, value }, { rejectWithValue }) => {
    try {
      const updateData = {
        updatedOn: serverTimestamp(),
      };

      if (field === "name") {
        updateData.name = value;
      } else if (field === "amount") {
        updateData.amount = value;
      } else if (field === "status") {
        updateData.isActive = value;
      }

      await updateDoc(doc(db, dbSetting.SavingTable, id), updateData);
      
      return { id, field, value };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const savingSlice = createSlice({
  name: "savings",
  initialState: { data: [], loading: false, error: null },
  reducers: {
    setSavings: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Saving
      .addCase(addSaving.pending, (state) => {
        state.loading = true;
      })
      .addCase(addSaving.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addSaving.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update Saving
      .addCase(updateSaving.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSaving.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = { ...state.data[index], [action.payload.field]: action.payload.value };
        }
      })
      .addCase(updateSaving.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setSavings } = savingSlice.actions;
export default savingSlice.reducer;
