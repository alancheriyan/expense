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

// Subscribe to banking details
export const subscribeToBankingDetails = () => (dispatch) => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const bankingDetailsQuery = query(
    collection(db, dbSetting.BankingTable),
    where("userId", "==", userId),
    orderBy("createdOn")
  );

  const unsubscribe = onSnapshot(bankingDetailsQuery, (snapshot) => {
    const bankingDetails = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date?.toDate().toISOString() || null, 
      createdOn: doc.data().createdOn?.toDate().toISOString() || null,
      updatedOn: doc.data().updatedOn?.toDate().toISOString() || null,
    }));
    dispatch(setBankingDetails(bankingDetails));
  });

  return unsubscribe;
};

// Add banking record
export const addBankingDetails = createAsyncThunk(
    "banking/addBanking",
    async ({ data }, { rejectWithValue }) => { 
      const userId = localStorage.getItem("userId");
      if (!userId) return rejectWithValue("User ID is missing from localStorage");
      if (!data) return rejectWithValue("No data found");
  
      try {
        const newDocRef = await addDoc(collection(db, dbSetting.BankingTable), {
          institutionName: data.name,
          balance: data.balance,
          type: data.type,
          paymentTypeId: data.paymentTypeId,
          incomeTypes:data.incomeTypes,
          createdOn: serverTimestamp(),
          updatedOn: serverTimestamp(),
          userId,
        });
  
        return { id: newDocRef.id, userId, ...data };
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  
  // Update banking record
  export const updateBankingDetails = createAsyncThunk(
    "banking/updateBanking",
    async ({ id, data }, { rejectWithValue }) => { 
      if (!id) return rejectWithValue("ID is required for updating.");
      if (!data) return rejectWithValue("No data found.");
      try {
        const updateData = {
          institutionName: data.name,
          balance: data.balance,
          type: data.type,
          incomeTypes:data.incomeTypes,
          paymentTypeId: data.paymentTypeId,
          updatedOn: serverTimestamp(),
        };
  
        await updateDoc(doc(db, dbSetting.BankingTable, id), updateData);
  
        return { id, ...data };
      } catch (error) {
        return rejectWithValue(error.message);
      }
    }
  );
  

// Delete banking record
export const deleteBankingDetails = createAsyncThunk(
  "banking/deleteBanking",
  async (id, { rejectWithValue }) => {
    try {
      await deleteDoc(doc(db, dbSetting.BankingTable, id));
      return id;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const bankingSlice = createSlice({
  name: "banking",
  initialState: { data: [], loading: false, error: null },
  reducers: {
    setBankingDetails: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(addBankingDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBankingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addBankingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(updateBankingDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBankingDetails.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = { ...state.data[index], [action.payload.field]: action.payload.value };
        }
      })
      .addCase(updateBankingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(deleteBankingDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBankingDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.data = state.data.filter((banking) => banking.id !== action.payload);
      })
      .addCase(deleteBankingDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setBankingDetails } = bankingSlice.actions;
export default bankingSlice.reducer;