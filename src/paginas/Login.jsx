import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import Alerta from '../components/Alerta'
import clienteAxios from "../config/clienteAxios"
import useAuth from '../hooks/useAuth'


const Login = () => {
    
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ alerta, setAlerta ] = useState({})

    const navigate = useNavigate()

    const { setAuth, setJswtoken } = useAuth()

    const handleSubmit = async e => {
        e.preventDefault()

        if([email, password].includes('')){
            setAlerta({
                msg: 'Todos los campos son obligatorios',
                error: true
            })
        }
    
        try {
            const { data } = await clienteAxios.post('/usuarios/login', {email, password})
            setAlerta({})
            // Almacenamos en el localStorage de nuestro navegador, chrome.
            localStorage.setItem('token', data.token)
            setAuth(data)
            navigate('/proyectos')
            

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
            <h1 className="text-sky-600 font-black text-6xl">Inicia Sesión y Administra tus <span className="text-slate-700">Proyectos</span></h1>

            {msg && <Alerta alerta={alerta} />}

            <form className="my-10 p-10 bg-white shadow rounded-lg" onSubmit={handleSubmit}>
                <div className="my-5">
                    <label className="text-gray-600 text-xl font-bold block" htmlFor="email">EMAIL</label>
                    <input className="w-full mt-3 p-3 border rounded-xl bg-gray-50" type='email' placeholder="Ingresa tu correo" id="email" value={email} onChange={e => setEmail(e.target.value)} />
                </div>
                <div className="my-5">
                    <label className="text-gray-600 text-xl font-bold block" htmlFor="password">PASSWORD</label>
                    <input className="w-full mt-3 p-3 border rounded-xl bg-gray-50" type='password' placeholder="Ingresa tu password" id="password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="on" />
                </div>

                <input type='submit' value='Iniciar Sesión' className="w-full mb-5 bg-sky-600 py-3 text-white uppercase font-bold rounded hover:bg-sky-700 cursor-pointer transition-colors" />
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link to='/registrar' className="block text-center my-5 text-slate-500 uppercase text-sm">
                    No tienes una cuenta?, Regístrate
                </Link>
                <Link to='/olvide-password' className="block text-center my-5 text-slate-500 uppercase text-sm">
                    Olvidé mi Password
                </Link>
            </nav>
        </>
    )
}

export default Login