export default function validarCrearProducto(valores){
    let errores={}
    if(!valores.nombre){
        errores.nombre="El nombre es obligatorio"
    }

    if(!valores.empresa){
        errores.empresa="El nombre de la empresa es obligatorio"
    }

    if(!valores.descripcion){
        errores.descripcion="La descripcion del producto es obligatorio"
    }

    if(!valores.url){
        errores.url="La URL del producto es obligatoria"
    }else if(!/^(ftp|http|https):\/\/[^ "]+$/.test(valores.url)){
        errores.url="El formato de la URL no es valido"
    }


    return errores


}