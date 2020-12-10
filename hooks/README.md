# CUSTOM HOOK FORM VALIDATION

## Modo de uso

el hook toma tres parametros:
-valores
-validaciones
-funcion

```javascript
const { valores, errores, submitForm, handleSubmit, handleChange } = useForm(
  STATE_INICIAL,
  validarCrearCuenta,
  crearCuenta
);
```

### valores:

seran el state inicial, contienen los campos del formulario por lo cual varian en cada form

```javascript
const STATE_INICIAL = {
  nombre: "",
  email: "",
  password: "",
};
```

### validaciones:

son las validaciones especificas de cada formulario, retorna los errores que queremos validar

```javascript
export default function validarCrearCuenta(valores) {
  let errores = {};
  if (!valores.nombre) {
    errores.nombre = "El nombre es obligatorio";
  }

  if (!valores.email) {
    errores.email = "El email es obligatorio";
  } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(valores.email)) {
    errores.email = "Email no valido";
  }

  if (!valores.password) {
    errores.password = "El password es obligatorio";
  } else if (valores.password.length < 6) {
    errores.password = "El password debe ser de al menos 6 caracteres";
  }
  return errores;
}
```

### funcion

es la funcion que ejecutaremos al hacer el submit en caso que no hayan errores de validacion

```javascript
const crearCuenta = () => {
  console.log("Creando cuenta");
  //ejemplo guardar el usuario en la base de datos
};
```

debemos extraer el nombre de cada campo y asignarlo al value en los inputs
const { email, nombre, password } = valores;

ej:

```javascript
<input
  type="text"
  id="nombre"
  placeholder="Tu nombre"
  name="nombre"
  value={nombre}
  onChange={handleChange}
/>
```
