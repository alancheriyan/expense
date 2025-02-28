import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "../DataAcess/firebase";
import { dbSetting } from "../DataAcess/dbSetting";

export const subscribeToTransactionDetails = () => (dispatch) => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const transactionDetailsQuery = query(
    collection(db, dbSetting.TransactionMaster),
    where("userId", "==", userId),
    orderBy("createdOn")
  );

  const unsubscribe = onSnapshot(transactionDetailsQuery, (snapshot) => {
    const transactionDetails = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdOn: doc.data().createdOn?.toDate().toISOString() || null,
      updatedOn: doc.data().updatedOn?.toDate().toISOString() || null,
    }));
    dispatch(setTransactionDetails(transactionDetails));
  });

  return unsubscribe;
};

export const addTransactionDetails = createAsyncThunk(
  "transaction/addTransaction",
  async (_, { rejectWithValue }) => {
    const userId = localStorage.getItem("userId");
    if (!userId) return rejectWithValue("User ID is missing from localStorage");

    try {
      const newDocRef = await addDoc(collection(db, dbSetting.TransactionMaster), {
        createdOn: serverTimestamp(),
        updatedOn: serverTimestamp(),
        userId,
      });

      return { id: newDocRef.id, userId };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateTransactionDetails = createAsyncThunk(
  "transaction/updateTransaction",
  async ({ id, field, value }, { rejectWithValue }) => {
    try {
      const updateData = {
        updatedOn: serverTimestamp(),
        [field]: value,
      };

      await updateDoc(doc(db, dbSetting.TransactionMaster, id), updateData); 

      return { id, field, value };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: { data: [], loading: false, error: null },
  reducers: {
    setTransactionDetails: (state, action) => { // Fixed typo
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTransactionDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(addTransactionDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addTransactionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      .addCase(updateTransactionDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateTransactionDetails.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = { ...state.data[index], [action.payload.field]: action.payload.value };
        }
      })
      .addCase(updateTransactionDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setTransactionDetails } = transactionSlice.actions;
export default transactionSlice.reducer;
