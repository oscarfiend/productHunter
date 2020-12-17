import { useRouter } from 'next/router'
import React, { useContext, useEffect, useState } from 'react'
import Error404 from '../../components/layout/404'
import Layout from '../../components/layout/Layout'
import {FirebaseContext} from '../../firebase'
import {css} from '@emotion/react'
import styled from '@emotion/styled'
import formatDistanceToNow from 'date-fns/formatDistanceToNow'
import {es} from 'date-fns/locale'
import { Campo, InputSubmit } from '../../components/ui/Formulario'
import Boton from '../../components/ui/Boton'

const Contenedor=styled.div`
    @media (min-width:768px){
        display:grid;
        grid-template-columns:2fr 1fr;
        column-gap:2rem;
    }
`
const CreadorProducto=styled.p`
    padding:.5rem 2rem;
    background-color:#DA552F;
    color:#FFFFFF;
    text-transform:uppercase;
    font-weight:bold;
    display:inline-block;
    text-align:center;
`

const Producto = () => {

    const [producto, setProducto] = useState({})
    const [error, setError] = useState(false)
    const [comentario,setComentario]=useState({})

    const {firebase,usuario} = useContext(FirebaseContext);

    const router=useRouter()
    const id=router.query.id

    useEffect(() => {
        var docRef = firebase.db.collection("productos").doc(id);
        docRef.get().then(function(doc) {
        if (doc.exists) {
            setProducto(doc.data());
            setError(false)
        } else {
            setError(true)
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });
    }, [id])

    const {nombre,descripcion,url,urlimagen,creado,empresa,votantes,votos,comentarios,creador}=producto;


    const handleVotar=()=>{
        if(!usuario){
            return router.push('/login')
        }

        //verficar si el usuario ha votado
        if(votantes.includes(usuario.uid)){
            return;
        }

        //obtener y sumar un nuevo voto
        const nuevoTotal=votos+1;
        
        const nuevoVotantes=[...votantes,usuario.uid]

        //acutalizar en la base de datos
        firebase.db.collection('productos').doc(id).update({votos:nuevoTotal,votantes:nuevoVotantes})

        setProducto({
            ...producto,
            votos:nuevoTotal
        })
    }

    //guardar comentarios 
    const comentarioChange=e=>{
        setComentario({
            ...comentario,
            [e.target.name]:e.target.value
        })
    }

    const handleSubmit=e=>{
        e.preventDefault()
        if(!usuario){
            router.push("/")
        }

        comentario.usuarioId=usuario.uid
        comentario.usuarioNombre=usuario.displayName

        //tomar copia de comentarios y agregarlo al arreglo
        const nuevosComentarios=[...comentarios,comentario]

        //actualizar la DB
        firebase.db.collection('productos').doc(id).update({
            comentarios:nuevosComentarios
        })

        //actualizar state
        setProducto({
            ...producto,
            comentarios:nuevosComentarios
        })
    }

    //identifica si el comentario es del creador del producto
    const esCreador=id=>{
        if(creador.id===id){
            return true
        }
    }
    return (
            <Layout>
                {error&& <Error404/>}
                {
                    producto.ObjectKeys===0 &&
                   <p>Cargando...</p>
                }
                <div className="contenedor">
                    <h1 css={css`
                        text-align:center;
                        margin-top:5rem;
                        `}>{nombre}</h1>
                    <Contenedor >
                        <div>
                            {creado&&

                            <p>Publicado hace: {formatDistanceToNow(new Date(creado),{locale:es}) }</p>
                            }
                        <p>Publicado por: {creador?.nombre} de {empresa}</p>
                        <img src={urlimagen} alt=""/>
                        <p>{descripcion}</p>
                        {
                            usuario &&
                            <>
                            <h2>Agrega tu comentario</h2>
                            <form onSubmit={handleSubmit}>
                                <Campo>
                                    <input type="text" name="mensaje" onChange={comentarioChange}/>

                                </Campo>
                                <InputSubmit type="submit"  value="Agregar comentario"/>
                            </form>
                            </>
                        }
                        <h2 css={css`
                            margin:2rem 0;
                        `}>Comentarios:</h2>
                        <ul>

                        {comentarios && comentarios.map((comentario,i)=>(
                            <li key={i} css={css`
                                border:1px solid #e1e1e1;
                                padding:2rem;
                            `}>
                                <p>{comentario.mensaje}</p>
                                <p>Escrito por: 
                                    <span css={css`
                                        font-weight:bold;
                                    `}>
                                      {' '}  {comentario.usuarioNombre}
                                    </span>
                                </p>
                                {esCreador(comentario.usuarioId) &&
                                    <CreadorProducto>Es creador</CreadorProducto>
                                }
                            </li>
                        ))}
                        </ul>
                        </div>
                        <div>
                            <Boton target="_blank" bgColor="true" href={url}>Visitar URL</Boton>
                            <div css={css`margin-top:5rem;`}>
                            <p css={css`
                            text-align:center;
                            `}>{votos} Votos</p>
                            {
                                usuario &&
                                <Boton onClick={handleVotar}>Votar</Boton>
                            }
                            </div>
                        </div>
                    </Contenedor>
                </div>
            </Layout>
    )
}

export default Producto
