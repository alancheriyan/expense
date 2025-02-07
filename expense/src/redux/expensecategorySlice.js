import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, getDocs, addDoc, updateDoc, doc, serverTimestamp, Timestamp, query, where } from "firebase/firestore";
import { db } from "../DataAcess/firebase";
import { dbSetting } from "../DataAcess/dbSetting";

// Fetch Categories from Firestore with userId filter
export const fetchCategories = createAsyncThunk(
  "categories/fetchCategories", 
  async (_, { rejectWithValue }) => {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    
    if (!userId) {
      return rejectWithValue("User ID is missing from localStorage");
    }

    try {
      const categoriesQuery = query(
        collection(db, dbSetting.CategoryTable),
        where("userId", "==", userId) // Filter by userId
      );
      const querySnapshot = await getDocs(categoriesQuery);
      
      const categories = querySnapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          createdOn: data.createdOn instanceof Timestamp ? data.createdOn.toDate().toISOString() : null,
          updatedOn: data.updatedOn instanceof Timestamp ? data.updatedOn.toDate().toISOString() : null,
          userId: data.userId // Add userId to the object
        };
      });

      return categories;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Add New Category to Firestore with userId
export const addCategory = createAsyncThunk(
  "categories/addCategory", 
  async (category, { rejectWithValue }) => {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    if (!userId) {
      return rejectWithValue("User ID is missing from localStorage");
    }

    try {
      const newDocRef = await addDoc(collection(db, dbSetting.CategoryTable), {
        name: "",
        isActive:true,
        createdOn: serverTimestamp(),
        updatedOn: serverTimestamp(),
        userId: userId, // Include userId in the new document
      });

      return { 
        id: newDocRef.id, 
        name: "", 
        isActive:true,
        userId: userId // Add userId to the result object
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update Category in Firestore
export const updateCategory = createAsyncThunk(
  "categories/updateCategory", 
  async (updatedCategory, { rejectWithValue }) => {
    const userId = localStorage.getItem('userId'); // Get userId from localStorage
    if (!userId) {
      return rejectWithValue("User ID is missing from localStorage");
    }

    try {
      await updateDoc(doc(db, dbSetting.CategoryTable, updatedCategory.id), {
        name: updatedCategory.name,
        isActive:true,
        updatedOn: serverTimestamp(),
      });

      return updatedCategory; // Return the updated object to Redux store
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: { data: [], loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Categories
      .addCase(fetchCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Add Category
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload); // Add new category to the state
      })
      .addCase(addCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Category
      .addCase(updateCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCategory.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload; // Update Redux state
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default categorySlice.reducer;
