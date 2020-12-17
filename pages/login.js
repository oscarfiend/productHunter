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
import validarLogin from "../validacion/validarLogin";


const Login = () => {
    const [error, setError] = useState(false)

  const STATE_INICIAL = {
    email: "",
    password: "",
  };

  const { valores, errores, handleSubmit, handleChange } = useForm(
    STATE_INICIAL,
    validarLogin,
    iniciarSesion
  );

  const { email, password } = valores;

  async function iniciarSesion(){
    try {
        await firebase.login(email,password)
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
          Iniciar Sesion
        </h1>
        <Formulario onSubmit={handleSubmit} autoComplete="off">
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
          <InputSubmit type="submit" value="Iniciar Sesion" />
        </Formulario>
      </>
    </Layout>
  );
}

export default Login
