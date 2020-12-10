import React, { useState,useEffect } from 'react'

const useForm = (stateInicial,validar,fn) => {

    const [valores, setValores] = useState(stateInicial);
    const [errores, setErrores] = useState({})
    const [submitForm, setSubmitForm] = useState(false)

    useEffect(() => {
        if(submitForm){
            const noErrores=Object.keys(errores).length===0;
            if(noErrores){
                fn();
            }
            setSubmitForm(false)
        }
    }, [errores])

    //funcion que se ejecuta cuando el usuario escibre algo
    const handleChange=(e)=>{
        setValores({
            ...valores,
            [e.target.name]:e.target.value
        })
    }

    //funcion que se ejecuta cunado el usuario hace submit
    const handleSubmit=(e)=>{
        e.preventDefault();
        const erroresValidacion=validar(valores)
        setErrores(erroresValidacion)
        setSubmitForm(true)
        
    }

    return {
        valores,
        errores,
        submitForm,
        handleSubmit,
        handleChange
    }
}

export default useForm
