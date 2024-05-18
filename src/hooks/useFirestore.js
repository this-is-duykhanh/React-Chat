import { useState, useEffect } from "react";
import {db} from '../firebase/config'

const useFirestore = (collection, condition) => {

    const [data, setData] = useState([]);

     useEffect(() => {
        // let collectionRef = db.collection(collection).orderBy('createdAt')
        if (!collection) {
            console.error("Collection name is required");
            return;
        }

        let collectionRef = db.collection(collection).orderBy('createdAt');

        if(condition){
            const { fieldName, operator, compareValue } = condition;
            if(!condition.compareValue || !condition.compareValue.length){
                return ;
            }
            collectionRef = collectionRef.where(fieldName, operator, compareValue);
        }

        const unsubscribe = collectionRef.onSnapshot(
            (snapshot) => {
                const data = snapshot.docs.map((doc) =>({
                    ...doc.data(),
                    id: doc.id,
                }));

                setData(data);

        });

        return () => unsubscribe();
    }, [collection, condition]);

    return data;
}

export default useFirestore;