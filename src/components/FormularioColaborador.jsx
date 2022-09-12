import { useState } from "react"
import useProyecto from "../hooks/useProyecto"
import Alerta from "./Alerta"

const FormularioColaborador = () => {
    
    const [ email, setEmail ] = useState('')

    const { mostrarAlerta, alerta, submitColaborador } = useProyecto()

    const handleSubmit = e => {
        e.preventDefault()

        if(email === '') {
            mostrarAlerta({
                msg: 'El email es obligatorio',
                error: true
            })
            return
        }

        submitColaborador(email)
    }

    const { msg } = alerta
    
    return (
        
        <form onSubmit={handleSubmit} className="bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow">

            {msg && <Alerta alerta={alerta} />}
            
            <div className='mb-5'>
                <label className='text-sm font-bold text-gray-700 uppercase' htmlFor='email'>Email Colaborador</label>
                <input type='email' id='email' placeholder='Correo del Usuario'
                    className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md'
                    value={email} onChange={e => setEmail(e.target.value)}
                />
            </div>

            <input type='submit' value='Buscar Colaborador'
                className='w-full p-3 text-sm text-white font-bold cursor-pointer rounded uppercase bg-sky-600 hover:bg-sky-700 transition-colors'
            />

        </form>
    )
}

export default FormularioColaborador