import { collection, query, getDocs,orderBy,setDoc, doc   } from 'firebase/firestore';
import { dbSetting,prodDatabase,devDatabase } from './dbSetting';
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

export const fetchBanking = async () => {  
  try {  
    const bankingQuery = query(
      collection(db, dbSetting.BankingTable),  
      orderBy("sequence") // Order by the "sequence" field  
    );  
    const querySnapshot = await getDocs(bankingQuery);  

    return querySnapshot.docs.map((doc) => ({  
      id: doc.id,  
      ...doc.data(),  
    }));  
  } catch (error) {  
    console.error("Error fetching banking data:", error);  
    throw error;  
  }  
};  



const backupData = async (prodTable, devTable) => {
  try {
    debugger;
    // Fetch data from production table (Firestore collection)
    const prodTableRef = collection(db, prodTable);
    const snapshot = await getDocs(prodTableRef);

    if (!snapshot.empty) {
      const data = {};
      snapshot.forEach(doc => {
        data[doc.id] = doc.data(); // Store data by document ID
      });

      // Replace data in the dev table
      const devTableRef = collection(db, devTable);
      for (const id in data) {
        const devDocRef = doc(devTableRef, id); // Reference to the document in the dev collection
        await setDoc(devDocRef, data[id]); // Set data in the dev collection
      }

      console.log(`Backup successful for ${prodTable} to ${devTable}`);
    } else {
      console.log(`No data found in production table: ${prodTable}`);
    }
  } catch (error) {
    console.error("Error backing up data: ", error);
  }
};
export const backupAllTables = async () => {
  debugger;
  for (const key in prodDatabase) {
    if (prodDatabase.hasOwnProperty(key)) {
      await backupData(prodDatabase[key], devDatabase[key]);
    }
  }
}