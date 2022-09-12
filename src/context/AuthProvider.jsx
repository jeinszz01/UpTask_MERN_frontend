import { useState, useEffect, createContext } from "react";
import { useNavigate } from "react-router-dom";
import clienteAxios from "../config/clienteAxios";


const AuthContext = createContext()

const AuthProvider = ({children}) => {
    const [ auth, setAuth ] = useState({})
    const [ cargando, setCargando ] = useState(true)
    // Agregamos este state para q cuando nos logueemos aparescan los proyectos.
    const [jswToken, setJswToken] = useState(null);

    const navigate = useNavigate()

    // Comprobamos si en el localStorage hay un token del usuario.
    useEffect(() => {
        const autenticarUsuario = async () => {
            const token = localStorage.getItem('token')

            if(!token) {
                setCargando(false)
                return
            } // Si no existe un token, solo se ejecutará hasta aqui mas no las sgts lineas.
            setJswToken(token)
            // Configuramos el jwt
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                }
            }
            // En caso de q se aya logueado o ya este autenticado se ejecuta el try.
            try {
                const { data } = await clienteAxios('/usuarios/perfil', config)
                setAuth(data)
                //navigate('/proyectos') si mantenemos asi estemos en crear un nuevo p, actualizamos y se ira a la ruta esta.
            } catch (error) {
                setAuth({})
            } finally {
                setCargando(false)
            }
        }
        autenticarUsuario()
    }, [])

    const cerrarSesionAuth = () => {
        setAuth({})
    }

    return (
        <AuthContext.Provider
            value={{
                auth,
                setAuth,
                cargando,
                jswToken,
                cerrarSesionAuth
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export {
    AuthProvider
}

export default AuthContext