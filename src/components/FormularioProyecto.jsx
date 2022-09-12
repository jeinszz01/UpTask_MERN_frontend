import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import useProyecto from '../hooks/useProyecto'
import Alerta from "./Alerta"

const FormularioProyecto = () => {

    const [ nombre, setNombre ] = useState('')
    const [ descripcion, setDescipcion ] = useState('')
    const [ fechaEntrega, setFechaEntrega ] = useState('')
    const [ cliente, setCliente ] = useState('')
    const [ existeId, setExisteId ] = useState(null)    // state para ver si estamos creando o actulizando.

    const paramsUrlId = useParams()
    
    const { mostrarAlerta, alerta, submitProyecto, proyecto } = useProyecto()

    useEffect(() => {
        if(paramsUrlId.id) {
            setNombre(proyecto.nombre)
            setDescipcion(proyecto.descripcion)
            setFechaEntrega(proyecto.fechaEntrega?.split('T')[0])   // Encadenamiento opcional. ?
            setCliente(proyecto.cliente)
            setExisteId(proyecto._id)
        } else {
            console.log('Nuevo Proyecto')
        }
        
    }, [paramsUrlId])
    

    

    const handleSubmit = async e => {
        e.preventDefault()

        if([nombre, descripcion, fechaEntrega, cliente].includes('')) {
            mostrarAlerta({
                msg: 'Todos los campos son obligatorios.',
                error: true
            })
            return
        }
        // Pasar los datos hacia el provider.
        await submitProyecto({ existeId, nombre, descripcion, fechaEntrega, cliente })

        setNombre('')
        setDescipcion('')
        setFechaEntrega('')
        setCliente('')
        setExisteId(null)
    }

    const { msg } = alerta

    return (
        <form onSubmit={handleSubmit} className="bg-white py-10 px-5 md:w-2/3 rounded-lg shadow lg:w-1/2">
            
            {msg && <Alerta alerta={alerta} />}

            <div className="mb-5">
                <label htmlFor="nombre" className="text-gray-700 font-bold text-sm uppercase">Nombre del Proyecto</label>
                <input type="text" value={nombre} onChange={e => setNombre(e.target.value)} id="nombre" placeholder="Ingrese el nombre del Proyecto" className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md" />
            </div>
            
            <div className="mb-5">
                <label htmlFor="descripcion" className="text-gray-700 font-bold text-sm uppercase">Descripción</label>
                <textarea value={descripcion} onChange={e => setDescipcion(e.target.value)} id="descripcion" placeholder="Descripción del Proyecto" className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md" />
            </div>

            <div className="mb-5">
                <label htmlFor="fecha-entrega" className="text-gray-700 font-bold text-sm uppercase">Fecha Entrega</label>
                <input value={fechaEntrega} onChange={e => setFechaEntrega(e.target.value)} id="fecha-entrega" type='date' className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md" />
            </div>

            <div className="mb-5">
                <label htmlFor="cliente" className="text-gray-700 font-bold text-sm uppercase">Nombre del Cliente</label>
                <input type="text" value={cliente} onChange={e => setCliente(e.target.value)} id="cliente" placeholder="Ingrese el nombre del Cliente" className="border w-full p-2 mt-2 placeholder-gray-400 rounded-md" />
            </div>

            <input type='submit' value={existeId ? 'Editar Proyecto' : 'Crear Proyecto'} className="bg-sky-600 w-full p-3 text-white uppercase font-bold rounded hover:bg-sky-700 cursor-pointer transition-colors" />
            
        </form>
    )
}

export default FormularioProyecto