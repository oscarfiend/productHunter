import React, { useEffect, useState } from 'react'
import firebase from '../firebase'

const useAutenticacion = () => {

    const [usuarioAuntenticado, setUsuarioAuntenticado] = useState(null)

    useEffect(() => {
        const unsuscribe=firebase.auth.onAuthStateChanged(usuario=>{
            if(usuario){
                setUsuarioAuntenticado(usuario)
            }else{
                setUsuarioAuntenticado(null)
            }
        })
        return ()=>unsuscribe()
    }, [])

    return usuarioAuntenticado
}

export default useAutenticacion
