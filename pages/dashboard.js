import Sidebar from "components/Sidebar";
import CheckAuth from "components/CheckAuth";

export default function Dashboard() {

    return (
        <CheckAuth>
        <Sidebar></Sidebar>
        </CheckAuth>
    )
}