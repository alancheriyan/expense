import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp, Timestamp, query, where } from "firebase/firestore";
import { db } from "../DataAcess/firebase";
import { dbSetting } from "../DataAcess/dbSetting";

// Fetch Income Types from Firestore with userId filter
export const fetchIncomeTypes = createAsyncThunk(
  "incomeTypes/fetchIncomeTypes", 
  async (_, { rejectWithValue }) => {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    
    if (!userId) {
      return rejectWithValue("User ID is missing from localStorage");
    }

    try {
      const incomeTypesQuery = query(
        collection(db, dbSetting.IncomeTypeTable),
        where("userId", "==", userId) // Filter by userId
      );
      const querySnapshot = await getDocs(incomeTypesQuery);
      
      const incomeTypes = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          name: data.name,
          isActive: data.isActive,
          createdOn: data.createdOn instanceof Timestamp ? data.createdOn.toDate().toISOString() : null,
          updatedOn: data.updatedOn instanceof Timestamp ? data.updatedOn.toDate().toISOString() : null,
          userId: data.userId // Add userId to the object
        };
      });

      return incomeTypes;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add New Income Type to Firestore with userId
export const addIncomeType = createAsyncThunk(
  "incomeTypes/addIncomeType", 
  async (_, { rejectWithValue }) => {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    
    if (!userId) {
      return rejectWithValue("User ID is missing from localStorage");
    }

    try {
      const newDocRef = await addDoc(collection(db, dbSetting.IncomeTypeTable), {
        name: "",
        isActive: true,
        createdOn: serverTimestamp(),
        updatedOn: serverTimestamp(),
        userId: userId, // Include userId in the new document
      });

      return { 
        id: newDocRef.id, 
        name: "", 
        isActive: true, 
        userId: userId // Add userId to the result object
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Income Type in Firestore
export const updateIncomeType = createAsyncThunk(
  "incomeTypes/updateIncomeType", 
  async (updatedIncomeType, { rejectWithValue }) => {
    try {
      await updateDoc(doc(db, dbSetting.IncomeTypeTable, updatedIncomeType.id), {
        name: updatedIncomeType.name,
        isActive: updatedIncomeType.isActive ?? true,
        updatedOn: serverTimestamp(),
      });

      return updatedIncomeType; // Return the updated object to Redux store
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const incomeTypeSlice = createSlice({
  name: "incomeTypes",
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Income Types
      .addCase(fetchIncomeTypes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchIncomeTypes.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchIncomeTypes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Income Type
      .addCase(addIncomeType.pending, (state) => {
        state.loading = true;
      })
      .addCase(addIncomeType.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload); // Add new income type to the state
      })
      .addCase(addIncomeType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Income Type
      .addCase(updateIncomeType.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateIncomeType.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload; // Update Redux state
        }
      })
      .addCase(updateIncomeType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default incomeTypeSlice.reducer;
