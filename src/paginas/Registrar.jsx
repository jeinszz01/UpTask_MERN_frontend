import { useState } from "react"
import { Link } from "react-router-dom"
import Alerta from "../components/Alerta"
import clienteAxios from "../config/clienteAxios"

const Registrar = () => {

    const [ nombre, setNombre ] = useState('')
    const [ email, setEmail ] = useState('')
    const [ password, setPassword ] = useState('')
    const [ repetirPassword, setRepetirPassword ] = useState('')
    const [ alerta, setAlerta ] = useState({})

    const handleSubmit = async e => {
        e.preventDefault()  //en form x defecto hay un action.

        if([nombre, email, password, repetirPassword].includes('')) {
            setAlerta({ msg: 'Todos los campos son obligatorios.', error: true })
            return
        }
        if(password !== repetirPassword) {
            setAlerta({ msg: 'Los passwords no son iguales', error: true })
            return
        }
        if(password.length < 6) {
            setAlerta({ msg: 'Password muy corto, agrega mínimo 6 caracteres', error: true })
            return
        }
        setAlerta({})   // si ninguno de lo if se cumple, alerta se qedara basio.

        // Crear el usuario en la Api.
        try {
            // cliente axios en config.
            const { data } = await clienteAxios.post('/usuarios', { nombre, email, password }) // luego d la , se pone los datos a enviar.
            setAlerta({
                msg: data.msg,
                error: false
            })
            setNombre('')
            setEmail('')
            setPassword('')
            setRepetirPassword('')


        } catch (error) {
            setAlerta({
                msg: error.response.data.msg,
                error: true
            })
        }
    }

    const { msg } = alerta  //extraemos msg de alerta.

    return (
        <>
            <h1 className="text-sky-600 font-black text-6xl">Crea tu Cuenta y Administra tus <span className="text-slate-700">Proyectos</span></h1>

            { msg && <Alerta alerta={alerta} /> }
            
            <form onSubmit={handleSubmit} className="my-10 p-10 bg-white shadow rounded-lg">

                <div className="my-5">
                    <label className="text-gray-600 text-xl font-bold block uppercase" htmlFor="nombre">Nombre</label>
                    <input value={nombre} onChange={e => setNombre(e.target.value)} className="w-full mt-3 p-3 border rounded-xl bg-gray-50" type='text' placeholder="Tu nombre" id="nombre" />
                </div>
                <div className="my-5">
                    <label className="text-gray-600 text-xl font-bold block uppercase" htmlFor="email">Email</label>
                    <input value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-3 p-3 border rounded-xl bg-gray-50" type='email' placeholder="Ingresa tu correo" id="email" />
                </div>
                <div className="my-5">
                    <label className="text-gray-600 text-xl font-bold block uppercase" htmlFor="password">Password</label>
                    <input value={password} onChange={e => setPassword(e.target.value)} className="w-full mt-3 p-3 border rounded-xl bg-gray-50" type='password' placeholder="Ingresa tu password" id="password" autoComplete="on" />
                </div>
                <div className="my-5">
                    <label className="text-gray-600 text-xl font-bold block uppercase" htmlFor="password2">Repite tu Password</label>
                    <input value={repetirPassword} onChange={e => setRepetirPassword(e.target.value)} className="w-full mt-3 p-3 border rounded-xl bg-gray-50" type='password' placeholder="Repetir tu password" id="password2" autoComplete="on" />
                </div>

                <input type='submit' value='Crear Cuenta' className="w-full mb-5 bg-sky-600 py-3 text-white uppercase font-bold rounded hover:bg-sky-700 cursor-pointer transition-colors" />
            
            </form>

            <nav className="lg:flex lg:justify-between">
                <Link to='/' className="block text-center my-5 text-slate-500 uppercase text-sm">
                    Ya tienes una cuenta?, Inicia Sesión
                </Link>
                <Link to='/olvide-password' className="block text-center my-5 text-slate-500 uppercase text-sm">
                    Olvidé mi Password
                </Link>
            </nav>
        </>
    )
}

export default Registrar