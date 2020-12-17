import Layout from '../components/layout/Layout'
import { Fragment, useContext, useEffect, useState } from 'react'
import {FirebaseContext} from '../firebase'
import DetalleProducto from '../components/layout/DetalleProducto'


export default function Home() {

  const [listaproductos, setProductos] = useState([])

  const {firebase} = useContext(FirebaseContext)
  const {db}=firebase

  useEffect(() => {
    const obtenerProductos=()=>{
      db.collection("productos").orderBy('creado', 'desc').get().then(function(querySnapshot) {
        const productos =querySnapshot.docs.map(doc=> {  
          return{
            id:doc.id,
            ...doc.data()
          }
          
        });
        setProductos(productos)
      });
      
    }
    obtenerProductos()
  }, [])

  return (
    <Fragment>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {listaproductos.map(producto=>(
                <DetalleProducto key={producto.id} producto={producto}/>
              ))}
            </ul>
          </div>
        </div>
      </Layout>
    </Fragment>
  )
}
