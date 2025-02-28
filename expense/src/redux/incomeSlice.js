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

// Subscribe to income details
export const subscribeToincomeDetails = () => (dispatch) => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const incomeDetailsQuery = query(
    collection(db, dbSetting.IncomeTable),
    where("userId", "==", userId),
    orderBy("createdOn")
  );

  const unsubscribe = onSnapshot(incomeDetailsQuery, (snapshot) => {
    const incomeDetails = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate().toISOString() || null, 
      createdOn: doc.data().createdOn?.toDate().toISOString() || null,
      updatedOn: doc.data().updatedOn?.toDate().toISOString() || null,
    }));
    dispatch(setincomeDetails(incomeDetails));
  });

  return unsubscribe;
};

// Add income
export const addincomeDetails = createAsyncThunk(
  "income/addincome",
  async ({ currentDate }, { rejectWithValue }) => { 
    const userId = localStorage.getItem("userId");
    if (!userId) return rejectWithValue("User ID is missing from localStorage");

    try {
      const currentDateTimestamp = Timestamp.fromDate(new Date(currentDate));
      const newDocRef = await addDoc(collection(db, dbSetting.IncomeTable), {
        amount: "",
        categoryId: "",
        paymentTypeId: "",
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

// Update income
export const updateincomeDetails = createAsyncThunk(
  "income/updateincome",
  async ({ id, field, value }, { rejectWithValue }) => {
    try {
      const updateData = {
        updatedOn: serverTimestamp(),
        [field]: value,
      };

      await updateDoc(doc(db, dbSetting.IncomeTable, id), updateData);

      return { id, field, value };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete income
export const deleteincomeDetails = createAsyncThunk(
  "income/deleteincome",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, dbSetting.IncomeTable, id));
      return id; // Return the deleted income ID to remove it from state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const incomeSlice = createSlice({
  name: "incomes",
  initialState: { data: [], loading: false, error: null },
  reducers: {
    setincomeDetails: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add income
      .addCase(addincomeDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(addincomeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addincomeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update income
      .addCase(updateincomeDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateincomeDetails.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = { ...state.data[index], [action.payload.field]: action.payload.value };
        }
      })
      .addCase(updateincomeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete income
      .addCase(deleteincomeDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteincomeDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((income) => income.id !== action.payload);
      })
      .addCase(deleteincomeDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setincomeDetails } = incomeSlice.actions;
export default incomeSlice.reducer;
