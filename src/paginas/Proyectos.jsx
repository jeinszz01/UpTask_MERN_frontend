import { useEffect } from "react"
import useProyecto from "../hooks/useProyecto"
import ListaProyectos from "../components/ListaProyectos"
import Alerta from "../components/Alerta"


let socket

const Proyectos = () => {
    // Setearemos la ultima pagina dnd ingresó el usuario para q cuadno vuelva a logearse lo redireccione a esa pag.
    //localStorage.setItem('lastPath', '/proyectos');
    const { proyectos, alerta } = useProyecto()

    const { msg } = alerta

    // useEffect(() => {
    //     socket = io(import.meta.env.VITE_BACKEND_URL)
    //     socket.emit('prueba', proyectos)

    //     socket.on('respuesta', (persona) => {
    //         console.log('Desde el frontend Persona: ', persona)
    //     })
    // })  // sin dependencias [] para q corra cada vez q aya un cambio.
    
    return (
        <>
            <h1 className='text-4xl font-black'>Proyectos</h1>

            {msg && <Alerta alerta={alerta} />}
            
            <div className="bg-white shadow mt-10 rounded-lg">
                {proyectos.length ? 
                    proyectos.map(proyecto => (
                    <ListaProyectos proyecto={proyecto} key={proyecto._id} />
                )) 
                : <p className="text-center text-gray-600 uppercase p-5">No hay Proyectos aún.</p> }
            </div>
        </>
    )
}

export default Proyectos