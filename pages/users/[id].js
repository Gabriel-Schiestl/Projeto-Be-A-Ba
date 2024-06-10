import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function User() {

const router = useRouter();
const { id } = router.query;
const [user, setUser] = useState("");


useEffect(() => {

    const getUser = async () => {   

        try{

        const result = await axios.get(`/api/UserAPI?id=${id}`);

        if(result) setUser(result.data);

        } catch (e) {
            console.log(e);
        }

    }

    getUser();

}, [id]);
}