import { useState, useEffect, createContext } from "react";
import clienteAxios from "../config/clienteAxios";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import useAuth from "../hooks/useAuth";

let socket

const ProyectoContext = createContext()

const ProyectoProvider = ({children}) => {

    const [ proyectos, setProyectos ] = useState([])  // Arreglo ya q son varios proyectos.
    const [ alerta, setAlerta ] = useState({})
    const [ proyecto, setProyecto ] = useState({})  // Objeto
    const [ cargando, setCargando ] = useState(false)  // State para cuando se cambie o seleccione otro proyecto
    const [ modalFormularioTarea, setModalFormularioTarea ] = useState(false)
    const [ tarea, setTarea ] = useState({})
    const [ modalEliminarTarea, setModalEliminarTarea ] = useState(false)
    const [ colaborador, setColaborador ] = useState({})
    const [ modalEliminarColaborador, setModalEliminarColaborador ] = useState(false)
    const [ buscador, setBuscador ] = useState(false)
    //const { jswToken } = useAuth()
    const { auth } = useAuth()

    const navigate = useNavigate()

    useEffect(() => {
        const obtenerProyectos = async () => {
            try {
                const token = localStorage.getItem('token')
                if(!token) return   // Si no hay un token no se podra agregar un proyecto, no se ejecuta las sgt lineas.

                const config = {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    }
                }
                const { data } = await clienteAxios('/proyectos', config)
                setProyectos(data)

                //const lastPath = localStorage.getItem('lastPath') || '/projects'
                //navigate(lastPath);
            } catch (error) {
                console.log(error)
            }
        }
        obtenerProyectos()
    }, [auth])

    useEffect(() => {
        socket = io(import.meta.env.VITE_BACKEND_URL)
    }, [])
    
    // Mostrar y ocultar las alertas.
    const mostrarAlerta = alerta => {
        setAlerta(alerta)

        setTimeout(() => {
            setAlerta({})
        }, 3500);
    }

    // Almacenando un proyecto en la bd.
    const submitProyecto = async proyecto => {
        if(proyecto.existeId){
            await editarProyecto(proyecto)
        } else {
            await crearProyecto(proyecto)
        }
    }
    // Funciones para el formulario
    const crearProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return   // Si no hay un token no se podra agregar un proyecto, no se ejecuta las sgt lineas.

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/proyectos', proyecto, config)
            // Al guardar un nuevo proyecto nos direcciona a proyectos pero no se carga el nuevo proyecto. para esto:
            setProyectos([...proyectos, data])
            setAlerta({
                msg: 'Proyecto creado correctamente',
                error: false
            })
            // Nos redirecciona a proyectos luego de crear un proyecto.
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 2000)
        } catch (error) {
            console.log(error)
        }
    }

    const editarProyecto = async proyecto => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return   // Si no hay un token no se podra agregar un proyecto, no se ejecuta las sgt lineas.

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/proyectos/${proyecto.existeId}`, proyecto ,config)
            //Sincronizar el state
            const proyectosActualizados = proyectos.map(proyectoState => proyectoState._id === data._id ? data : proyectoState)
            setProyectos(proyectosActualizados) // almacenamos en proyectos para mostrarlos en la lista d proyectos y q se vean todos sin tener q actualizar pa pag.
            
            setAlerta({
                msg: 'Proyecto actualizado correctamente',
                error: false
            })
            // Nos redirecciona a proyectos luego de crear un proyecto.
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 2000)

        } catch (error) {
            console.log(error)
        }
    }

    const obtenerProyecto = async id => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return   // Si no hay un token no se podra agregar un proyecto, no se ejecuta las sgt lineas.

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios(`/proyectos/${id}`, config)
            setProyecto(data)
            setAlerta({})
        } catch (error) {
            navigate('/proyectos')
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
            setTimeout(() => {
                setAlerta({})
            }, 2500);
        } finally {
            //Luego del try o catch se ejecuta esto.
            setCargando(false)
        }
    }
     
    const eliminarProyecto = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/proyectos/${id}`, config)
            setAlerta({
                msg: data.msg,
                error: false
            })
            const proyectosActualizados = proyectos.filter(proyectoState => proyectoState._id !== id)
            setProyectos(proyectosActualizados)
            
            setTimeout(() => {
                setAlerta({})
                navigate('/proyectos')
            }, 2000)
        } catch (error) {
            console.log(error)
        }
    }

    // Cambiar el estado para ver o no el modal, y limpiar al hacer click en nueva tarea en Proyecto.jsx
    // con useEffect en ModalForTa if para evitar errores.
    const handleModalTarea = () => {
        setModalFormularioTarea(!modalFormularioTarea)
        setTarea({})
    }

    const submitTarea = async tarea => {
        if(tarea.existeId) {
            await editarTarea(tarea)
        } else {
            await crearTarea(tarea)
        }
    }
    const crearTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/tareas', tarea, config)
            // Agrega la tarea al state - esto lo copiamos a socket io funcion submitTareasProyecto()
            // const proyectoActualizado = {...proyecto}   // tomamos una copia de los proyectos existentes
            // proyectoActualizado.tareas = [...proyecto.tareas, data] // a proyectos.tareas le vamos agregar data o la tarea q acabamos de agregar.
            // setProyecto(proyectoActualizado)

            setAlerta({})
            setModalFormularioTarea(false)

            // sOCKET IO
            socket.emit('nueva tarea', data)

        } catch (error) {
           console.log(error) 
        }
    }
    const editarTarea = async tarea => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.put(`/tareas/${tarea.existeId}`, tarea, config)
            
            setAlerta({})
            setModalFormularioTarea(false)

            // SOCKET
            socket.emit('actualizar tarea', data)

        } catch (error) {
            console.log(error) 
        }
    }

    const handleModalEditarTarea = async tarea => {
        setTarea(tarea) 
        setModalFormularioTarea(true)
    }

    const handleModalEliminarTarea = tarea => {
        setTarea(tarea) 
        setModalEliminarTarea(!modalEliminarTarea)
    }

    const eliminarTarea = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.delete(`/tareas/${tarea._id}`, config)
            setAlerta({
                msg: data.msg,
                error: false
            })
            
            setModalEliminarTarea(false)

            //Socket
            socket.emit('eliminar tarea', tarea)

            setTarea({})
            setTimeout(() => {
                setAlerta({})
            }, 3000);
        } catch (error) {
            console.log(error)
        }
    }

    const submitColaborador = async email => {
        setCargando(true)
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post('/proyectos/colaboradores', {email}, config)
            setColaborador(data)
            setAlerta({})
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        } finally {
            setCargando(false)
        }
    }

    const agregarColaborador = async email => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/colaboradores/${proyecto._id}`, email, config)
            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setTimeout(() => {
                setAlerta({})
                navigate(`/proyectos/${proyecto._id}`)
            }, 2500);
            
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const handleModalEliminarColaborador = (colaborador) => {
        setModalEliminarColaborador(!modalEliminarColaborador)
        setColaborador(colaborador)
    }
    const eliminarColaborador = async () => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/proyectos/eliminar-colaborador/${proyecto._id}`, { id: colaborador._id }, config)

            const proyectoActualizado = {...proyecto}
            proyectoActualizado.colaboradores = proyectoActualizado.colaboradores.filter(colaboradorState => colaboradorState._id !== colaborador._id)

            setProyecto(proyectoActualizado)

            setAlerta({
                msg: data.msg,
                error: false
            })
            setColaborador({})
            setModalEliminarColaborador(false)
            setTimeout(() => {
                setAlerta({})  
            }, 3000);
        } catch (error) {
            console.log(error.response)
        }
    }

    const completarTarea = async id => {
        try {
            const token = localStorage.getItem('token')
            if(!token) return

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            const { data } = await clienteAxios.post(`/tareas/estado/${id}`, {}, config)

            setTarea({})
            setAlerta({})
            //SOCKET
            socket.emit('cambiar estado', data)

        } catch (error) {
            console.log(error.response)
        }
    }

    const handleBuscador = () => {
        setBuscador(!buscador)
    }

    //Socket io -------------------------------------------
    const submitTareasProyecto = (tarea) => {
        // Agrega la tarea al state
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = [...proyectoActualizado.tareas, tarea]
        setProyecto(proyectoActualizado)
    }

    const eliminarTareaProyecto = tarea => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.filter(tareaState => tareaState._id !== tarea._id)
        setProyecto(proyectoActualizado)
    }

    const actualizarTareaProyecto = tarea => {
        // Actualizar el state de tareas dentro de un proyecto
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map( tareaState => tareaState._id === tarea._id ? tarea : tareaState )
        setProyecto(proyectoActualizado)
    }

    const cambiarEstadoTarea = tarea => {
        const proyectoActualizado = {...proyecto}
        proyectoActualizado.tareas = proyectoActualizado.tareas.map(tareaState => tareaState._id === tarea._id ? tarea : tareaState)
        setProyecto(proyectoActualizado)
    }
    //-----------------------------

    const cerrarSesionProyectos = () => {
        setProyectos([])
        setProyecto({})
        setAlerta({})
    }
     
    return (
        <ProyectoContext.Provider
            value={{
                proyectos,
                mostrarAlerta,
                alerta,
                submitProyecto,
                obtenerProyecto,
                proyecto,
                cargando,
                eliminarProyecto,
                modalFormularioTarea,
                handleModalTarea,
                submitTarea,
                handleModalEditarTarea,
                tarea,
                handleModalEliminarTarea,
                modalEliminarTarea,
                eliminarTarea,
                submitColaborador,
                colaborador,
                agregarColaborador,
                modalEliminarColaborador,
                handleModalEliminarColaborador,
                eliminarColaborador,
                completarTarea,
                buscador,
                handleBuscador,
                submitTareasProyecto,
                eliminarTareaProyecto,
                actualizarTareaProyecto,
                cambiarEstadoTarea,
                cerrarSesionProyectos
            }}
        >
            {children}
        </ProyectoContext.Provider>
    )
}

export {
    ProyectoProvider
}

export default ProyectoContext