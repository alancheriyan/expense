import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, onSnapshot,orderBy } from "firebase/firestore";
import { db } from "../DataAcess/firebase";
import { dbSetting } from "../DataAcess/dbSetting";

// Subscribe to real-time updates for Payment Types
export const subscribeToPaymentTypes = () => (dispatch) => {
  const userId = localStorage.getItem("userId");
  if (!userId) return;

  const paymentTypesQuery = query(
    collection(db, dbSetting.PaymentTypeTable),
    where("userId", "==", userId),
    where ("isActive","==",true),
    orderBy("createdOn")
  );


  return onSnapshot(paymentTypesQuery, (snapshot) => {
    const paymentTypes = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdOn: doc.data().createdOn?.toDate().toISOString() || null,
      updatedOn: doc.data().updatedOn?.toDate().toISOString() || null,
    }));
    dispatch(setPaymentTypes(paymentTypes));
  });
};

// Add New Payment Type
export const addPaymentType = createAsyncThunk("paymentTypes/addPaymentType", async ({ value = "" } = {}, { rejectWithValue }) => {
  const userId = localStorage.getItem("userId");
  if (!userId) return rejectWithValue("User ID is missing from localStorage");

  try {
    const newDocRef = await addDoc(collection(db, dbSetting.PaymentTypeTable), {
      name: value,
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


export const updatePaymentType = createAsyncThunk(
  "paymentTypes/updatePaymentType",
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

      await updateDoc(doc(db, dbSetting.PaymentTypeTable, id), updateData);
      
      return { id, field, value };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);


const paymentTypeSlice = createSlice({
  name: "paymentTypes",
  initialState: { data: [], loading: false, error: null },
  reducers: {
    setPaymentTypes: (state, action) => {
      state.data = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Add Payment Type
      .addCase(addPaymentType.pending, (state) => {
        state.loading = true;
      })
      .addCase(addPaymentType.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload);
      })
      .addCase(addPaymentType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Payment Type
      .addCase(updatePaymentType.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePaymentType.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.data.findIndex((item) => item.id === action.payload.id);
        if (index !== -1) {
          state.data[index] = action.payload;
        }
      })
      .addCase(updatePaymentType.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setPaymentTypes } = paymentTypeSlice.actions;
export default paymentTypeSlice.reducer;
