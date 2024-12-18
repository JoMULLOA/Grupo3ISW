import { useNavigate } from 'react-router-dom';
import { register } from '@services/auth.service.js';
import Form from "@components/Form";
import useRegister from '@hooks/auth/useRegister.jsx';
import { showErrorAlert, showSuccessAlert } from '@helpers/sweetAlert.js';
import '@styles/form.css';

const Register = () => {
	const navigate = useNavigate();
	const {
        errorEmail,
        errorRut,
        errorData,
        handleInputChange
    } = useRegister();
	const registerSubmit = async (data) => {
	    try {
	        const response = await register(data);
	        if (response.status === 'Success') {
	            showSuccessAlert('¡Registrado!','Usuario registrado exitosamente.');
	            setTimeout(() => {
	                navigate('/home');
	            }, 3000)
	        } else if (response.status === 'Client error') {
	            errorData(response.details);
	        }
	    } catch (error) {
	        console.error("Error al registrar un usuario: ", error);
	        showErrorAlert('Cancelado', 'Ocurrió un error al registrarse.');
	    }
	}

	const patternRut = new RegExp(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)

    const allowedDomains = ["@gmail.cl", "@gmail.com", "@hotmail.cl", "@cocina.cl"]; // Lista de dominios permitidos

    const emailDomain = (value) => {
        const isValidDomain = allowedDomains.some(domain => value.endsWith(domain));
        return isValidDomain || `El correo debe terminar en uno de los siguientes dominios: ${allowedDomains.join(", ")}`;
    };

	return (
	    <main className="container">
			<Form
				title="Registro"
				fields={[
					{
						label: "Nombre completo",
						name: "nombreCompleto",
						placeholder: "Nombre de la persona",
                        fieldType: 'input',
						type: "text",
						required: true,
						minLength: 15,
						maxLength: 50,
                        pattern: /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
						patternMessage: "Debe contener solo letras y espacios",
					},
                    {
                        label: "Correo electrónico",
                        name: "email",
                        placeholder: "example@gmail.cl",
                        fieldType: 'input',
                        type: "email",
                        required: true,
                        minLength: 15,
                        maxLength: 35,
                        errorMessageData: errorEmail,
                        validate: {
                            emailDomain: (value) => emailDomain(value)
                        },
                        onChange: (e) => handleInputChange('email', e.target.value)
                    },
                    {
						label: "Rut",
                        name: "rut",
                        placeholder: "23.770.330-1",
                        fieldType: 'input',
                        type: "text",
						minLength: 9,
						maxLength: 12,
						pattern: patternRut,
						patternMessage: "Debe ser xx.xxx.xxx-x o xxxxxxxx-x",
						required: true,
                        errorMessageData: errorRut,
                        onChange: (e) => handleInputChange('rut', e.target.value)
                    },
                    {
                        label: "Rol",
                        name: "rol",
                        fieldType: 'select',
                        options: [
                            { value: 'administrador', text: 'Administrador' },
                            { value: 'chef', text: 'Chef' },
                            { value: 'garzon', text: 'Garzon' },
                        ],
                        required: true,
                        onChange: (e) => {
                            console.log("Rol seleccionado:", e.target.value); // Muestra el rol seleccionado en la consola
                            handleInputChange('rol', e.target.value);
                        },
                        style: { color: 'black' } // Asegura que el texto sea visible
                    }
                    ,
                    {
                        label: "Contraseña",
                        name: "password",
                        placeholder: "**********",
                        fieldType: 'input',
                        type: "password",
                        required: true,
                        minLength: 8,
                        maxLength: 26,
                        pattern: /^[a-zA-Z0-9]+$/,
                        patternMessage: "Debe contener solo letras y números",
                    },
				]}
				buttonText="Guardar"
				onSubmit={registerSubmit}
			/>
		</main>
	);
};

export default Register;
