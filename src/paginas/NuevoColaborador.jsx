import { useEffect } from "react"
import FormularioColaborador from "../components/FormularioColaborador"
import useProyecto from "../hooks/useProyecto"
import { useParams } from "react-router-dom"
import Alerta from "../components/Alerta"

const NuevoColaborador = () => {

    const { obtenerProyecto, proyecto, colaborador, cargando, agregarColaborador, alerta } = useProyecto()
    const { id } = useParams()

    useEffect(() => {
        obtenerProyecto(id)
    }, [])

    if(!proyecto?._id) return <Alerta alerta={alerta} />

    return (
        <>
            <h1 className="text-4xl font-bold text-gray-700">Añadir Colaborador(a) al Proyecto: <span className="font-black">{proyecto.nombre}</span></h1>

            <div className="mt-10 flex justify-center">
                <FormularioColaborador />
            </div>
            {cargando ? <p className="text-center">cargando...</p> : colaborador?._id && (
                <div className="flex justify-center mt-10">
                    <div className="bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full">
                        <h2 className="text-center mb-10 text-2xl font-bold">Resultado:</h2>

                        <div className="flex justify-between items-center">
                            <p>{colaborador.nombre}</p>

                            <button type="button" onClick={() => agregarColaborador({
                                email: colaborador.email
                            })} className="bg-green-600 px-5 py-2 rounded-md uppercase text-white font-bold text-sm" >
                                Agregar al Proyecto
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}

export default NuevoColaborador