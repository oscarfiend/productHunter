import { css } from "@emotion/react";
import Router from 'next/router'
import React, { useState } from "react";
import Layout from "../components/layout/Layout";
import {
  Campo,
  Error,
  Formulario,
  InputSubmit,
} from "../components/ui/Formulario";

import firebase from "../firebase";

//validaciones
import useForm from "../hooks/useForm";
import validarCrearCuenta from "../validacion/validarCrearProducto";

const CrearCuenta = () => {

    const [error, setError] = useState(false)

  const STATE_INICIAL = {
    nombre: "",
    email: "",
    password: "",
  };

  const { valores, errores, handleSubmit, handleChange } = useForm(
    STATE_INICIAL,
    validarCrearCuenta,
    crearCuenta
  );

  const { email, nombre, password } = valores;

  async function crearCuenta(){
    console.log(email);
    try {
      await firebase.registrar(nombre, email,password);
      Router.push("/")
    } catch (error) {
      setError(error.message)
    }
  };

  return (
    <Layout>
      <>
        <h1
          css={css`
            text-align: center;
            margin-top: 5rem;
          `}
        >
          Crear cuenta
        </h1>
        <Formulario onSubmit={handleSubmit} autoComplete="off">
          <Campo>
            <label htmlFor="nombre">Nombre</label>
            <input
              type="text"
              id="nombre"
              placeholder="Tu nombre"
              name="nombre"
              value={nombre}
              onChange={handleChange}
            />
          </Campo>
          {errores.nombre && <Error>{errores.nombre}</Error>}
          <Campo>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              placeholder="Tu email"
              name="email"
              value={email}
              onChange={handleChange}
            />
          </Campo>
          {errores.email && <Error>{errores.email}</Error>}
          <Campo>
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              placeholder="Tu password"
              name="password"
              value={password}
              onChange={handleChange}
            />
          </Campo>
          {errores.password && <Error>{errores.password}</Error>}
          {error && <Error>{error}</Error>}
          <InputSubmit type="submit" value="Crear cuenta" />
        </Formulario>
      </>
    </Layout>
  );
};

export default CrearCuenta;
