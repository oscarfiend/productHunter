import { css } from "@emotion/react";
import Router, { useRouter } from "next/router";
import FileUploader from "react-firebase-file-uploader";
import React, { useState, useContext } from "react";
import Layout from "../components/layout/Layout";
import {
  Campo,
  Error,
  Formulario,
  InputSubmit,
} from "../components/ui/Formulario";

import { FirebaseContext } from "../firebase";
import firebaseContext from "../firebase/context";

//validaciones
import useForm from "../hooks/useForm";
import validarCrearProducto from "../validacion/validarCrearProducto";
import Error404 from "../components/layout/404";

const NuevoProducto = () => {
  //state de las imagenes
  const [nombreimagen, setNombreImagen] = useState("");
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [urlimagen, seturlImagen] = useState("");

  const [error, setError] = useState(false);

  const STATE_INICIAL = {
    nombre: "",
    empresa: "",
    descripcion: "",
    url: "",
    imagen: "",
  };

  const { valores, errores, handleSubmit, handleChange } = useForm(
    STATE_INICIAL,
    validarCrearProducto,
    crearProducto
  );

  const { nombre, empresa, descripcion, url, imagen } = valores;

  //hook de routing para redireccionar
  const router = useRouter();

  //context con las operaciones crud de firebase
  const { usuario, firebase } = useContext(firebaseContext);
  

  async function crearProducto() {
    if (!usuario) {
      return router.push("/login");
    }

    //crear el objeto de nuevo producto
    const producto = {
      nombre,
      empresa,
      url,
      urlimagen,
      descripcion,
      votos: 0,
      comentarios: [],
      creado: Date.now(),
      creador:{
          id:usuario.uid,
          nombre:usuario.displayName
      },
      votantes:[]
    };

    //insertar producto en la base de datos
    firebase.db.collection("productos").add(producto);
    router.push("/")
  }

  const handleUploadStart = () => {
    setProgreso(0);
    setSubiendo(true);
  };

  const handleProgress = async (progreso, task) => {
    console.log(progreso);
    setProgreso(progreso);
    if(progreso === 100){
        handleUploadSuccess(task.snapshot.ref.name);
    }
}

  const handleUploadError = (error) => {
    setSubiendo(error);
    console.error(error);
  };

  const handleUploadSuccess = async nombreP => {
    console.log(nombreP)
    setProgreso(100);
    setSubiendo(false);
    setNombreImagen(nombreP);
    await firebase.storage
      .ref("productos")
      .child(nombreP)
      .getDownloadURL()
      .then(url => {
          seturlImagen(url)
          console.log(url)
        });
  };

  return (
    <Layout>
      {!usuario? <Error404/>
      :
      
      <>
        <h1
          css={css`
            text-align: center;
            margin-top: 5rem;
          `}
        >
          Nuevo producto
        </h1>
        <Formulario onSubmit={handleSubmit} autoComplete="off">
          <fieldset>
            <legend>Informacion General</legend>

            <Campo>
              <label htmlFor="nombre">Nombre</label>
              <input
                type="text"
                id="nombre"
                placeholder="Nombre del producto"
                name="nombre"
                value={nombre}
                onChange={handleChange}
              />
            </Campo>
            {errores.nombre && <Error>{errores.nombre}</Error>}

            <Campo>
              <label htmlFor="empresa">Empresa</label>
              <input
                type="text"
                id="empresa"
                placeholder="Nombre de la empresa"
                name="empresa"
                value={empresa}
                onChange={handleChange}
              />
            </Campo>
            {errores.empresa && <Error>{errores.empresa}</Error>}

            <Campo>
              <label htmlFor="imagen">Imagen</label>
              <FileUploader
                accept="img/*"
                id="imagen"
                name="imagen"
                randomizeFilename
                storageRef={firebase.storage.ref("productos")}
                onUploadStart={handleUploadStart}
                onUploadError={handleUploadError}
                //onUploadSuccess={handleUploadSuccess}
                onProgress={handleProgress}
              />
            </Campo>

            <Campo>
              <label htmlFor="url">url</label>
              <input
                type="url"
                id="url"
                placeholder="URL de tu producto"
                name="url"
                value={url}
                onChange={handleChange}
              />
            </Campo>
            {errores.url && <Error>{errores.url}</Error>}
          </fieldset>
          <fieldset>
            <legend>Sobre tu producto</legend>

            <Campo>
              <label htmlFor="descripcion">Descripcion</label>
              <textarea
                id="descripcion"
                placeholder="Tu nombre"
                name="descripcion"
                value={descripcion}
                onChange={handleChange}
              />
            </Campo>
            {errores.descripcion && <Error>{errores.descripcion}</Error>}
          </fieldset>

          {error && <Error>{error}</Error>}
          <InputSubmit type="submit" value="Crear producto" />
        </Formulario>
      </>
      }
    </Layout>
  );
};

export default NuevoProducto;
