import { Link } from "react-router-dom"
import useAuth from "../hooks/useAuth"

const SideBar = () => {
    const { auth } = useAuth()
    return (
        <aside className="md:w-1/3 lg:w-1/5 xl:w-1/6 px-5 py-10">
            <p className="text-xl font-bold">Hola: {auth.nombre}</p>
            
            <div className="flex gap-2 justify-center bg-sky-600 text-white w-full p-3 mt-5 rounded-lg cursor-pointer">
                <Link to='crear-proyecto' className="font-bold uppercase">Nuevo Proyecto</Link>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m3.75 9v6m3-3H9m1.5-12H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
            </div>
            
        </aside>
    )
}

export default SideBar