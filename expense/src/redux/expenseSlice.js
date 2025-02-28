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

// Subscribe to expense details
export const subscribeToexpenseDetails = () => (dispatch) => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const expenseDetailsQuery = query(
    collection(db, dbSetting.ExpenseTable),
    where("userId", "==", userId),
    orderBy("createdOn")
  );

  const unsubscribe = onSnapshot(expenseDetailsQuery, (snapshot) => {
    const expenseDetails = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate().toISOString() || null, 
      createdOn: doc.data().createdOn?.toDate().toISOString() || null,
      updatedOn: doc.data().updatedOn?.toDate().toISOString() || null,
    }));
    dispatch(setexpenseDetails(expenseDetails));
  });

  return unsubscribe;
};

// Add expense
export const addexpenseDetails = createAsyncThunk(
  "expense/addexpense",
  async ({ currentDate }, { rejectWithValue }) => { 
    const userId = localStorage.getItem("userId");
    if (!userId) return rejectWithValue("User ID is missing from localStorage");

    try {
      const currentDateTimestamp = Timestamp.fromDate(new Date(currentDate));
      const newDocRef = await addDoc(collection(db, dbSetting.ExpenseTable), {
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

// Update expense
export const updateexpenseDetails = createAsyncThunk(
  "expense/updateexpense",
  async ({ id, field, value }, { rejectWithValue }) => {
    try {
      const updateData = {
        updatedOn: serverTimestamp(),
        [field]: value,
      };

      await updateDoc(doc(db, dbSetting.ExpenseTable, id), updateData);

      return { id, field, value };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete expense
export const deleteexpenseDetails = createAsyncThunk(
  "expense/deleteexpense",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, dbSetting.ExpenseTable, id));
      return id; // Return the deleted expense ID to remove it from state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState: { data: [], loading: false, error: null },
  reducers: {
    setexpenseDetails: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Expense
      .addCase(addexpenseDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(addexpenseDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addexpenseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Expense
      .addCase(updateexpenseDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateexpenseDetails.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = { ...state.data[index], [action.payload.field]: action.payload.value };
        }
      })
      .addCase(updateexpenseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Expense
      .addCase(deleteexpenseDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteexpenseDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((expense) => expense.id !== action.payload);
      })
      .addCase(deleteexpenseDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setexpenseDetails } = expenseSlice.actions;
export default expenseSlice.reducer;
