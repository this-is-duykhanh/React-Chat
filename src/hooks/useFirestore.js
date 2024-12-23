import { useState, useEffect } from "react";
import {db} from '../firebase/config'

const useFirestore = (collection, condition) => {

    const [data, setData] = useState([]);


     useEffect(() => {
        if (!collection) {
            console.error("Collection name is required");
            return;
        }

        let collectionRef = db.collection(collection);

        if (condition) {
            const { fieldName, operator, compareValue } = condition;

            // Validate the condition
            if (!fieldName || !operator || compareValue === undefined || compareValue === null) {
                console.warn("Invalid Firestore query condition:", condition);
                return;
            }

            // Special case for array operators (e.g., "in", "array-contains-any")
            if (Array.isArray(compareValue) && compareValue.length === 0) {
                console.warn("Empty array for Firestore query condition:", condition);
                return;
            }

            try {
                // Apply the where clause
                collectionRef = collectionRef.where(fieldName, operator, compareValue);
            } catch (error) {
                console.error("Error applying Firestore where clause:", error);
                return;
            }
        }

        const unsubscribe = collectionRef.onSnapshot(
            (snapshot) => {
                try {
                    const newData = snapshot.docs.map((doc) => ({
                        ...doc.data(),
                        id: doc.id,
                    })).sort((a, b) => a.createdAt - b.createdAt);


                    setData(newData);
                } catch (error) {
                    console.error("Error fetching Firestore data:", error);
                }
            },
            (error) => {
                console.error("Firestore listener error:", error);
            }
        );

        return () => unsubscribe();
    }, [collection, condition]);

    return data;
}

export default useFirestore;