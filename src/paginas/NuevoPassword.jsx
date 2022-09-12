import { useState, useEffect } from "react"
import { Link, useParams } from "react-router-dom"
import clienteAxios from "../config/clienteAxios"
import Alerta from "../components/Alerta"

const NuevoPassword = () => {

    const [ tokenValido, setTokenValido ] = useState(false)
    const [ alerta, setAlerta ] = useState({})
    const [ password, setPassword ] = useState('')
    const [ passwordModificado, setPasswordModificado ] = useState(false)

    const params = useParams()
    const { token } = params

    useEffect(() => {
      const comprobarToken = async () => {
        try {
            // cliente axios.
            await clienteAxios(`/usuarios/olvide-password/${token}`)
            setTokenValido(true)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
      }
      comprobarToken()
    }, [])
    
    const { msg } = alerta

    const handleSubmit = async e => {
        e.preventDefault()

        if(password.length < 6) {
            setAlerta({
                msg: 'El password debe ser mínimo de 6 caracteres.',
                error: true
            })
            return
        }

        try {
            const { data } = await clienteAxios.post(`/usuarios/olvide-password/${token}`, { password })
            setAlerta({
                msg: data.msg,
                error: false
            })
            setPasswordModificado(true)
        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl">Reestrablece tu password y no pierdas acceso a tus <span className="text-slate-700">Proyectos</span></h1>
            
            { msg && <Alerta alerta={alerta} />}

            { tokenValido && (
                <form className="my-10 p-10 bg-white shadow rounded-lg" onSubmit={handleSubmit}>

                    <div className="my-5">
                        <label className="text-gray-600 text-xl font-bold block uppercase" htmlFor="password">Nuevo Password</label>
                        <input className="w-full mt-3 p-3 border rounded-xl bg-gray-50" value={password} onChange={e => setPassword(e.target.value)} type='password' placeholder="Escribe tu nuevo password" id="password" autoComplete="on" />
                    </div>

                    <input type='submit' value='Guardar Nuevo Password' className="w-full mb-5 bg-sky-600 py-3 text-white uppercase font-bold rounded hover:bg-sky-700 cursor-pointer transition-colors" />
            
                </form>
            )}
            
            {passwordModificado && (
                <Link to='/' className="block text-center my-5 text-slate-500 uppercase text-sm">
                    Iniciar Sesión
                </Link>
            )}
        </>
    )
}

export default NuevoPassword