import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

export default function User() {

const router = useRouter();
const { id } = router.query;
const [profile, setProfile] = useState("");


useEffect(() => {

    const getProfile = async () => {   

        try{

        const result = await axios.get(`/api/ProfileAPI?id=${id}`);

        if(result) setProfile(result.data);

        } catch (e) {
            console.log(e);
        }

    }

    getProfile();

}, [id]);
}