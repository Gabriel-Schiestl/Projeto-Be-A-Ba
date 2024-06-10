import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function User() {

const router = useRouter();
const { id } = router.query;
const [transaction, setTransaction] = useState("");


useEffect(() => {

    const getTransaction = async () => {   

        try{

        const result = await axios.get(`/api/TransactionAPI?id=${id}`);

        if(result) setTransaction(result.data);

        } catch (e) {
            console.log(e);
        }

    }

    getTransaction();

}, [id]);
}