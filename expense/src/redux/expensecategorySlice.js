import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, onSnapshot,orderBy } from "firebase/firestore";
import { db } from "../DataAcess/firebase";
import { dbSetting } from "../DataAcess/dbSetting";

// Subscribe to real-time updates for Categories
export const subscribeToCategories = () => (dispatch) => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;
  const categoriesQuery = query(
    collection(db, dbSetting.CategoryTable),
    where("userId", "==", userId),
    where ("isActive","==",true),
    orderBy("createdOn")
  );

  return onSnapshot(categoriesQuery, (snapshot) => {
    const categories = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdOn: doc.data().createdOn?.toDate().toISOString() || null,
      updatedOn: doc.data().updatedOn?.toDate().toISOString() || null,
    }));
    dispatch(setCategories(categories));
  });
};

// Add New Category
export const addCategory = createAsyncThunk("categories/addCategory", async (_, { rejectWithValue }) => {
  const userId = localStorage.getItem("userId");
  if (!userId) return rejectWithValue("User ID is missing from localStorage");

  try {
    const newDocRef = await addDoc(collection(db, dbSetting.CategoryTable), {
      name: "",
      isActive: true,
      createdOn: serverTimestamp(),
      updatedOn: serverTimestamp(),
      userId,
    });

    return { id: newDocRef.id, name: "", isActive: true, userId };
  } catch (error) {
    return rejectWithValue(error.message);
  }
});

// Update Category
export const updateCategory = createAsyncThunk(
  "categories/updateCategory",
  async ({ id, field, value }, { rejectWithValue }) => {
    try {
      const updateData = {
        updatedOn: serverTimestamp(),
      };

      if (field === "name") {
        updateData.name = value;
        updateData.isActive = true;
      } else if (field === "status") {
        updateData.isActive = value;
      }

      await updateDoc(doc(db, dbSetting.CategoryTable, id), updateData);
      
      return { id, field, value };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const categorySlice = createSlice({
  name: "categories",
  initialState: { data: [], loading: false, error: null },
  reducers: {
    setCategories: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Category
      .addCase(addCategory.pending, (state) => {
        state.loading = true;
      })
      .addCase(addCategory.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
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
          state.data[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setCategories } = categorySlice.actions;
export default categorySlice.reducer;
