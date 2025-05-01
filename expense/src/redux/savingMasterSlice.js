import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  where,
  onSnapshot,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../DataAcess/firebase";
import { dbSetting } from "../DataAcess/dbSetting";

// Subscribe to saving details
export const subscribeToSavingDetails = () => (dispatch) => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const savingDetailsQuery = query(
    collection(db, dbSetting.SavingMasterTable),
    where("userId", "==", userId),
    orderBy("createdOn")
  );

  const unsubscribe = onSnapshot(savingDetailsQuery, (snapshot) => {
    const savingDetails = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate().toISOString() || null,
      createdOn: doc.data().createdOn?.toDate().toISOString() || null,
      updatedOn: doc.data().updatedOn?.toDate().toISOString() || null,
    }));
    dispatch(setsavingDetails(savingDetails));
  });

  return unsubscribe;
};

// Add saving
export const addSavingDetails = createAsyncThunk(
  "saving/add",
  async ({ currentDate }, { rejectWithValue }) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return rejectWithValue("User ID is missing from localStorage");

    try {
      const currentDateTimestamp = Timestamp.fromDate(new Date(currentDate));
      const newDocRef = await addDoc(collection(db, dbSetting.SavingMasterTable), {
        amount: "",
        savingTypeId: "",
        date: currentDateTimestamp,
        createdOn: serverTimestamp(),
        updatedOn: serverTimestamp(),
        userId,
      });

      return { id: newDocRef.id, userId, date: currentDateTimestamp };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update saving
export const updateSavingDetails = createAsyncThunk(
  "saving/update",
  async ({ id, field, value }, { rejectWithValue }) => {
    try {
      const updateData = {
        updatedOn: serverTimestamp(),
        [field]: value,
      };

      await updateDoc(doc(db, dbSetting.SavingMasterTable, id), updateData);
      return { id, field, value };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete saving
export const deleteSavingDetails = createAsyncThunk(
  "saving/delete",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, dbSetting.SavingMasterTable, id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Slice
const savingMasterSlice = createSlice({
  name: "savings",
  initialState: { data: [], loading: false, error: null },
  reducers: {
    setsavingDetails: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Saving
      .addCase(addSavingDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(addSavingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addSavingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Saving
      .addCase(updateSavingDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateSavingDetails.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = {
            ...state.data[index],
            [action.payload.field]: action.payload.value,
          };
        }
      })
      .addCase(updateSavingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Saving
      .addCase(deleteSavingDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteSavingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((item) => item.id !== action.payload);
      })
      .addCase(deleteSavingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setsavingDetails } = savingMasterSlice.actions;
export default savingMasterSlice.reducer;
