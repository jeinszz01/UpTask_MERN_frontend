import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"

const OlvidePassword = () => {

    const [ email, setEmail ] = useState('')
    const [ alerta, setAlerta ] = useState({})

    const handleSubmit = async (e) => {
        e.preventDefault()

        if(email === '' || email.length < 6) {
            setAlerta({
                msg: 'El email es obligatorio',
                error: true
            })
            return
        }

        try {
            // cliente axios.
            const { data } = await clienteAxios.post(`/usuarios/olvide-password`, { email })
            
            setAlerta({
                msg: data.msg,
                error: false
            })

        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const { msg } = alerta

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl">Recupera tu Acceso y no pierdas tus <span className="text-slate-700">Proyectos</span></h1>

            {msg && <Alerta alerta={alerta} />}
            
            <form onSubmit={handleSubmit} className="my-10 p-10 bg-white shadow rounded-lg">

                <div className="my-5">
                    <label className="text-gray-600 text-xl font-bold block uppercase" htmlFor="email">Email</label>
                    <input className="w-full mt-3 p-3 border rounded-xl bg-gray-50" type='email' placeholder="Ingresa tu correo" id="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>

                <input type='submit' value='Enviar Instrucciones' className="w-full mb-5 bg-sky-600 py-3 text-white uppercase font-bold rounded hover:bg-sky-700 cursor-pointer transition-colors" />
            
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link to='/' className="block text-center my-5 text-slate-500 uppercase text-sm">
                    Ya tienes una cuenta?, Inicia Sesión
                </Link>
                <Link to='/registrar' className="block text-center my-5 text-slate-500 uppercase text-sm">
                    No tienes una cuenta?, Regístrate
                </Link>
            </nav>
        </>
    )
}

export default OlvidePassword