import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getSession } from 'next-auth/react';

export default function CheckAuth({ children }) {

    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {

        const authChecker = async () => {

            const session = await getSession();

            if (!session) {

                router.replace('/');

            } else {

                setLoading(false);

            }

        }

        authChecker();

    }, [router]);

    if (loading) {
        return <div>Redirecionando...</div>
    }

    return children;

}