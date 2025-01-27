import { collection, query, getDocs } from 'firebase/firestore';
import { dbSetting } from './dbSetting';
import { db } from './firebase';

export const fetchCategories = async () => {
  try {
    const categorysQuery = query(collection(db, dbSetting.CategoryTable));
    const querySnapshot = await getDocs(categorysQuery);

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error; // Re-throw the error to handle it in the calling code if needed
  }
};
