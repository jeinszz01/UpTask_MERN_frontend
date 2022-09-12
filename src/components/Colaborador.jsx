import useProyecto from "../hooks/useProyecto"

const Colaborador = ({colaborador}) => {
    const { email, nombre , _id} = colaborador
    const { handleModalEliminarColaborador } = useProyecto()
    return (
        <div className="border-b p-5 flex justify-between items-center">
            <div>
                <p className="font-bold">{nombre}</p>
                <p className="text-sm text-gray-600">{email}</p>
            </div>
            <div>
                <button type="button" onClick={() => handleModalEliminarColaborador(colaborador)} className="px-4 py-3 font-bold text-sm rounded-lg uppercase text-white bg-red-700 ">
                    Eliminar
                </button>
            </div>
        </div>
    )
}

export default Colaborador