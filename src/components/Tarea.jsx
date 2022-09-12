import { formatearFecha } from "../helpers/formatearFecha"
import useProyecto from "../hooks/useProyecto"
import useAdmin from "../hooks/useAdmin"

const Tarea = ({tarea}) => {

    const { handleModalEditarTarea, handleModalEliminarTarea, completarTarea } = useProyecto()
    const admin = useAdmin()

    const {_id, nombre, descripcion, fechaEntrega, prioridad, estado} = tarea

    return (
        <div className="border-b p-5 flex justify-between items-center">
            <div className="flex flex-col items-start">
                <p className="mb-1 text-xl">{nombre}</p>
                <p className="mb-1 text-sm text-gray-500 uppercase">{descripcion}</p>
                <p className="mb-1 text-sm">{formatearFecha(fechaEntrega)}</p>
                <p className="mb-1 text-gray-600">Prioridad: {prioridad}</p>
                { estado && <p className="text-xs bg-green-600 uppercase p-1 rounded-lg text-white">Completado por: {tarea.completado.nombre}</p>}
            </div>
            
            <div className="flex flex-col lg:flex-row gap-2">
                
                { admin && (
                    <button onClick={() => handleModalEditarTarea(tarea)} className="mb-1 px-4 py-3 text-white font-bold text-sm rounded-lg bg-indigo-600">Editar</button>
                )}

                <button onClick={() => completarTarea(_id)} className={`mb-1 px-4 py-3 text-white font-bold text-sm rounded-lg ${estado ? 'bg-sky-600' : 'bg-gray-600' }`}>{estado ? 'Completo' : 'Incompleto'}</button>

                { admin && (
                <button onClick={() => handleModalEliminarTarea(tarea)} className="px-4 py-3 text-white font-bold text-sm rounded-lg bg-red-700">Eliminar</button>
                )}
                
            </div>
        </div>
    )
}

export default Tarea