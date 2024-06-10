
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function User() {

const router = useRouter();
const { id } = router.query;
const [module, setModule] = useState("");


useEffect(() => {

    const getModule = async () => {   

        try{

        const result = await axios.get(`/api/ModuleAPI?id=${id}`);

        if(result) setModule(result.data);

        } catch (e) {
            console.log(e);
        }

    }

    getModule();

}, [id]);
}