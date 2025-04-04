import { db } from "../firebase";
import { collection, doc, setDoc, getDoc, getDocs, updateDoc, onSnapshot } from "firebase/firestore";

export interface InventoryItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

// Add or Update Inventory Item
export const addOrUpdateInventoryItem = async (item: InventoryItem) => {
  try {
    const itemRef = doc(db, "inventory", item.id);
    await setDoc(itemRef, item, { merge: true });
  } catch (error) {
    console.error("Error adding/updating inventory item:", error);
  }
};

// Get a Single Inventory Item
export const getInventoryItem = async (id: string): Promise<InventoryItem | null> => {
  try {
    const itemRef = doc(db, "inventory", id);
    const itemSnap = await getDoc(itemRef);
    return itemSnap.exists() ? (itemSnap.data() as InventoryItem) : null;
  } catch (error) {
    console.error("Error fetching inventory item:", error);
    return null;
  }
};

// Get All Inventory Items
export const getAllInventoryItems = async (): Promise<InventoryItem[]> => {
  try {
    const querySnapshot = await getDocs(collection(db, "inventory"));
    return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
  } catch (error) {
    console.error("Error fetching inventory:", error);
    return [];
  }
};

// Reduce Stock When an Item is Sold
export const reduceStock = async (id: string, quantity: number) => {
  try {
    const itemRef = doc(db, "inventory", id);
    const itemSnap = await getDoc(itemRef);

    if (itemSnap.exists()) {
      const currentQuantity = itemSnap.data().quantity;
      if (currentQuantity >= quantity) {
        await updateDoc(itemRef, { quantity: currentQuantity - quantity });
      } else {
        console.warn("Not enough stock!");
      }
    }
  } catch (error) {
    console.error("Error reducing stock:", error);
  }
};

// Listen for Real-Time Inventory Updates
export const listenToInventoryChanges = (callback: (items: InventoryItem[]) => void) => {
  const inventoryRef = collection(db, "inventory");
  return onSnapshot(inventoryRef, (snapshot) => {
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as InventoryItem));
    callback(items);
  });
};
