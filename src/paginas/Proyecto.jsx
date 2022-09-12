import { useEffect } from "react"
import { useParams, Link } from "react-router-dom"
import useProyecto from "../hooks/useProyecto"
import useAdmin from "../hooks/useAdmin"
import ModalFormularioTarea from "../components/ModalFormularioTarea"
import ModalEliminarTarea from "../components/ModalEliminarTarea"
import ModalEliminarColaborador from "../components/ModalEliminarColaborador"
import Tarea from "../components/Tarea"
import Alerta from "../components/Alerta"
import Colaborador from "../components/Colaborador"
import io from 'socket.io-client'

let socket

const Proyecto = () => {
    
    const { id } = useParams()
    // En cada pagina seteamos la url a lastPath para q se guarde.
    //localStorage.setItem('lastPath', `/proyectos/${id}`);
    const { obtenerProyecto, proyecto, cargando, handleModalTarea, alerta, submitTareasProyecto, eliminarTareaProyecto, actualizarTareaProyecto, cambiarEstadoTarea } = useProyecto()
    const admin = useAdmin()
    //obtenerProyecto(params.id) / una forma de hacerlo pero la forma standar seria en el hook
    // console.log(admin) nos retorna true o false, es para comprobar si el usuario q ingreso es el creador del proyecto.
    
    useEffect(() => {
        obtenerProyecto(id)
    }, [])
    //SOCKET
    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
        socket.emit('abrir proyecto', id)
    }, [])

    useEffect(() => {
        // Crear tarea con socket
        socket.on('tarea agregada', tareaNueva => {
            if(tareaNueva.proyecto === proyecto._id) {
                submitTareasProyecto(tareaNueva)
            }
        })
        // Eliminar tarea
        socket.on('tarea eliminada', tareaEliminada => {
            if(tareaEliminada.proyecto === proyecto._id) {
                eliminarTareaProyecto(tareaEliminada)
            }
        })
        // Actualizar Tarea
        socket.on('tarea actualizada', tareaActualizada => {
            if(tareaActualizada.proyecto._id = proyecto._id) {
                actualizarTareaProyecto(tareaActualizada)
            }
        })
        // Cambiar Estado (completo e incompleto)
        socket.on('nuevo estado', nuevoEstadoTarea => {
            if(nuevoEstadoTarea.proyecto._id === proyecto._id) {
                cambiarEstadoTarea(nuevoEstadoTarea)
            }
        })
    })
    
    
    
    const {nombre} = proyecto
    const {msg} = alerta

    return (
        // msg && alerta.error ? <Alerta alerta={alerta} /> : (
            <>
                <div className="flex justify-between">
                    <h1 className="font-black text-4xl">{nombre}</h1>

                    { admin && (
                        <div className="flex items-center gap-2 text-gray-400 hover:text-black cursor-pointer">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
                            </svg>

                            <Link to={`/proyectos/editar/${id}`} className='uppercase font-bold'>
                                Editar
                            </Link>
                        
                        </div>
                    )}
                </div>

                { admin && (
                    <button type="button" onClick={handleModalTarea} className="flex gap-2 text-sm px-5 py-3 mt-5 rounded-lg bg-sky-400 text-white w-full md:w-auto uppercase font-bold text-center justify-center items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Nueva Tarea
                    </button>
                )}

                <p className="font-bold text-xl mt-10">Tareas del Proyecto</p>

                <div className="flex justify-center">
                    <div className="w-full">
                        {/* {msg && <Alerta alerta={alerta} />} */}
                    </div>
                </div>
                

                <div className="bg-white shadow mt-10 rounded-lg">
                    {proyecto.tareas?.length ? 
                        proyecto.tareas?.map(tarea => ( 
                            <Tarea key={tarea._id} tarea={tarea} /> 
                        )) : 
                        <p className="text-center my-5 p-10">Aún no hay tareas en este proyecto.</p>
                    }
                </div>

                { admin && (
                    <>
                        <div className="flex items-center justify-between mt-10">
                            <p className="font-bold text-xl">Colaboradores</p>
                            <Link to={`/proyectos/nuevo-colaborador/${proyecto._id}`} className='font-bold uppercase text-gray-400 hover:text-black'>Añadir</Link>
                        </div>

                        <div className="bg-white shadow mt-10 rounded-lg">
                            {proyecto.colaboradores?.length ? 
                                proyecto.colaboradores?.map(colaborador => ( 
                                    <Colaborador key={colaborador._id} colaborador={colaborador} /> 
                                )) : 
                                <p className="text-center my-5 p-10">Aún no hay colaboradores en este proyecto.</p>
                            }
                        </div>
                    </>
                )}
                

                <ModalFormularioTarea />
                <ModalEliminarTarea />
                <ModalEliminarColaborador />
            </>
        )
    //)
}

export default Proyecto