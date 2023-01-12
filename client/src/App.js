import logo from './flexlogo.svg';
import './App.css';
import axios from 'axios';
import React, { useState } from 'react';
import emailjs from 'emailjs-com';

// Initialize var data2
//var data2 = null;
var userverified = false;
var pinsent = false;
var PIN = null;
async function handleSubmit(event) {
  event.preventDefault();

}

// Send a get request including the token in the header


function App() {

  const [pokeid, setButtonText] = useState('');

  // pone invisible el segundo formulario
  const [primerForm, setFormVisible] = useState('text'); // pone visible el segundo formulario
  const [message, setMessage] = useState('');

  const handleChange = event => {
    setMessage(event.target.value);


  };
  //function sendEmail(e) {
  //  e.preventDefault();    //This is important, i'm not sure why, but the email won't send without it

  //  emailjs.sendForm('service_ys3gwox', 'template_vbra6fd', message, 'QEG5ErBievtxVewrA')
  //    .then((result) => {
           //This is if you still want the page to reload (since e.preventDefault() cancelled that behavior) 
  //    }, (error) => {
  //        console.log(error.text);
  //    });
  //}


  async function changeVis(type) {

    var segundoForm = document.getElementById('segundoForm');
    var captcha = document.getElementById('captcha');
    segundoForm.style.visibility = type;
    captcha.style.visibility = 'hidden';
  }

  
  async function SendRequest(event) {
    const token = "2f8f065441ae4a80ab23f6b3cd9837b4" // Azure API Management subscription key
    event.preventDefault();
    console.log("res");
    //axios.get('https://testpasswordfunctions.azurewebsites.net/api/HttpTrigger2?clientId=apim-testpasswordAPI'),

    const data = {
      mail: message
    };

    //const data2 = {
    //  Emailaddress: message
    //}

    const config = {
      headers: {
        'Access-Control-Allow-Origin':'*',
        'Ocp-Apim-Subscription-Key': token
      }
    };

    // Depending if the user is verified or not, the request when pressing the button will be different
    if (pinsent === true) {
      // Tercera vez que pulsas el botón
      // Enviamos petición para que se compare el PIN introducido con el que se ha enviado (se envía sólo el mail a la petición)
      axios.post('https://testpasswordapi.azure-api.net/testpasswordfunctions/getpin', data, config)
      .then((res) => {
        console.log(res);
        try {
          if (res.data[0].PIN === PIN) {
            // Si el PIN es correcto, se genera la nueva contraseña random y se envía al usuario, faltaría mirar la hora
            setButtonText("Your new password is:"+ Math.floor(Math.random() * 1000000).toString());
            // Se llamaría al job template de atom correspondiente para cambiar la contraseña
          }
          else {
            setButtonText("The PIN is not correct, please try again");
          }
        }
        catch (error) {
          setButtonText("An error has occurred, please refresh the page and try again");
        }

      }, (error) => {
        setButtonText('An error has occurred, please refresh the page and try again');
      });
      pinsent = true;
    }

    if (userverified === true) {
      // Segunda vez que pulsas el botón
      axios.put('https://testpasswordapi.azure-api.net/testpasswordfunctions/generate-pin', data, config)
        .then((res) => {
          console.log(res);
          try {
            setButtonText("A pin has been sent, please introduce it in the box to reset your password");
            pinsent = true;
            // Ahora debe aparecer un cuadro de texto donde introducir el pin
            userverified = false;
            // Desactivamos el userverified por posibles problemas
          }
          catch (error) {
            setButtonText("An error has occurred, please refresh the page and try again");
          }

        }, (error) => {
          setButtonText('An error has occurred, please refresh the page and try again');
        });

    }

    else {
      // Primera vez que pulsas el botón
      axios.post('https://testpasswordapi.azure-api.net/testpasswordfunctions/comprobarusuario', data, config)
        .then((res) => {
          console.log(res);
          try {
            if (res.data[0].u_unlock_user_allowed === "true" && res.data[0].u_reset_password_allowed === "true") {
              setButtonText("User verified, please select the reset method");
              // Verify user changing the boolean
              userverified = true;
              setFormVisible('hidden');
              changeVis('visible');
            }
            else {
              setButtonText("User not verified or function not available");
            }
            //setButtonText("Su ID es: "+ res.data);
          }
          catch (error) {
            setButtonText("Domain not found, please check the introduced mail address");
          }

        }, (error) => {
          setButtonText('Domain not found, please check the introduced mail address');
        });
    }
  }


  return (
<div className="App">

<header className="App-header">
  <img src={logo} className="App-logo" alt="logo" />
  <script src=
    "https://www.google.com/recaptcha/api.js" async defer />


  <form class="login" onSubmit={handleSubmit} method="post">

    <div class="login__field">
      <i class="login__icon fas fa-user"></i>
      <input type={primerForm} name="email" class="login__input" onChange={handleChange} value={message} placeholder="Email" />
      <input type={primerForm} name="pin" class="login__input" onChange={handleChange} value={pinmessage} placeholder="PIN" />
      <select id="segundoForm" class="login__selector" name="typepins" >
        <option value="pJefe">send PIN to manager's email</option>
        <option value="pSMS">send PIN by SMS</option>


      </select>
    </div>

    <div class="login__field">
      <div id="captcha" class="g-recaptcha" data-sitekey="6LeszrQjAAAAAOe0tVYAt-DTNixnqPkbpeWUo9tt" />
      <button class="button login__submit" onClick={SendRequest} >
        <span class="button__text" name="submit_btn" > Forgot Password </span>
        <i class="button__icon fas fa-chevron-right"></i>
      </button>
    </div>
  </form>


  <a
    className="App-link"
    href="https://www.flexxible.com"
    target="_blank"
    rel="noopener noreferrer"
  >
    {pokeid}
  </a>
</header>
</div>
);
}


export default App;
