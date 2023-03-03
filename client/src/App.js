import logo from './flexlogo.svg';
import './App.css';
import axios from 'axios';
import React, { useState } from 'react';
import ReactLoading from "react-loading";


// Initialize var data2
//var data2 = null;
var userverified = false;
var pinsent = false;
async function handleSubmit(event) {
  event.preventDefault();

}

// Send a get request including the token in the header
var data = {
  mail: ""
};

var data2 = {
  mail: "",
  method: ""
};

var data3 = {
  mail: "",
  pin: ""
};

var tiempo = 29;
var password = "";

function App() {

  // Control del loader
  const [loading, setloading] = useState(false);

  // Método para el loader (paso 1: recopilar información)
  function isloading() {
    setloading(true);
    // Display some random text while the information is being loaded
    setButtonText("Loading...");
    setTimeout(() => {
      // Display another random text while the information is being loaded
      setButtonText("Updating information...");
    }, 10000);
    setTimeout(() => {
      setButtonText("Getting data...");
    }, 20000);

    setTimeout(() => {
      // Aquí irá el proceso que define si la carga ha finalizado o no (se puede hacer con un fetch o con un axios.get)
      setloading(false);
    }, 30000); // Este tiempo se debe cambiar con el tiempo que tarde en cargar la información
  }

  // Control del tiempo anti spam del botón
  const [delay, setDelay] = useState(false);

  function delayantispam() {
    setDelay(true);
    setButtonText("Verifying PIN...");
    setTimeout(() => {
      setDelay(false);
    }, 3000);
  }

  // Control de los elementos del formulario
  const [pokeid, setButtonText] = useState('');
  const [textorangebutton, settextorangebutton] = useState("Forgot Password");
  const [inputdisabled, setinputdisabled] = useState(false);
  const [selects, setSelects] = useState("pJefe"); // Estado para el select (DEFAULT: pJefe)
  const [butondiabled, setbutondiabled] = useState(false);
   
  const [telephonemethod, settelephonemethod] = useState(false); // Estado para el select 
  const [emailmethod, setemailmethod] = useState(false); // Estado para el select




  // pone invisible el segundo formulario
  const [primerForm, setFormVisible] = useState('text'); // pone visible el segundo formulario
  const [message, setMessage] = useState('');
  const [pinmessage, setPinMessage] = useState('Mail');
  const handleChange = event => {
    setMessage(event.target.value);


  };

  function intervalbutton() {
    // Your code here
    // Parameters are purely optional.
    setButtonText("Your new temporal password is: " + password + " you have " + tiempo + "s to copy it");
    tiempo--;
  }
  async function changeVis(type) {

    var segundoForm = document.getElementById('segundoForm');
    var captcha = document.getElementById('captcha');
    segundoForm.style.visibility = type;
    captcha.style.visibility = 'hidden';
  }



  async function SendRequest(event) {
    //const token = process.env['SNOW_INSTANCE_URL']; // Azure API Management subscription key
    event.preventDefault();
    console.log("res");
    //axios.get('https://testpasswordfunctions.azurewebsites.net/api/HttpTrigger2?clientId=apim-testpasswordAPI'),

    data2 = {
      mail: message,
      method: selects
    }
    if (!pinsent) {
      data = {
        mail: message
      };
    }
    else {
      //pin = {
      //  pin: message
      //};
      data3 = {
        mail: data.mail,
        pin: message
      }
    }


    const config = {
      headers: {
        'Access-Control-Allow-Origin': '*',
        //'Ocp-Apim-Subscription-Key': process.env.SUBSCRIPTION_KEY.toString() // No está definido, pendiente de revisar
        'Ocp-Apim-Subscription-Key': "efef36feaa5244cb82eaca12d1dad5ba"
      }
    };

    // Depending if the user is verified or not, the request when pressing the button will be different
    if (pinsent === true) {
      // Tercera vez que pulsas el botón
      delayantispam();

      // Enviamos petición para que se compare el PIN introducido con el que se ha enviado (se envía sólo el mail a la petición)
      axios.post('https://flexxsign-api.azure-api.net/FlexxSign-Functions/getpin', data3, config) // Esta función nos debe decir si el pin es correcto o no AQUÍ HAY QUE PASARLE PIN Y NO DATA
        .then((res) => {
          console.log(res);

          if (res.data.toString() === "Correct PIN") {
            // Si el PIN es correcto, se genera la nueva contraseña random y se envía al usuario, faltaría mirar la hora

            // Bloqueamos el botón para que no se pueda pulsar
            setbutondiabled(true);

            // Generamos la contraseña random
            var chars = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            var passwordLength = 12;


            for (var i = 0; i <= passwordLength; i++) {
              var randomNumber = Math.floor(Math.random() * chars.length);
              password += chars.substring(randomNumber, randomNumber + 1);
            }

            // Aquí se debe llamar a la función de Ansible que cambia la contraseña en el AD
            var finaldata = {
              mail: data3.mail,
              generatedpassword: password
            }
            axios.post('https://flexxsign-api.azure-api.net/FlexxSign-Functions/executereset', finaldata, config)
              .then((res) => {
                
              }, (error) => {
                
              });

            isloading();
            document.getElementById('botonCopy').style.visibility = 'visible';
            setTimeout(() => {
              setButtonText("Your new temporal password is: " + password + " you have " + 30 + "s to use it");
              

              var refreshIntervalId = setInterval(intervalbutton, 1000);

              setTimeout(() => {
                setButtonText("");
                document.getElementById('botonCopy').style.visibility = 'hidden';
                clearInterval(refreshIntervalId);
              }, 30000);

            }, 30000); // Este tiempo se debe cambiar con el tiempo que tarde en cargar la información
          }
          // Si el status es 403, el PIN es incorrecto y no se puede cambiar la contraseña hasta dentro de 24 horas
          else if (res.data.toString() === "Incorrect PIN") {
            setTimeout(() => {
              setButtonText("The PIN is not correct, please try again");
            }, 2500);

          }
          else {
            setTimeout(() => {
              setButtonText("You introduced the wrong PIN 3 times, you can't change your password until 24 hours have passed");
            }, 2500);
          }



        }, (error) => {
          setTimeout(() => {
            setButtonText("You introduced the wrong PIN 3 times, you can't change your password until 24 hours have passed");
          }, 2500);
        });

    }
    else if (userverified === true) {
      // Segunda vez que pulsas el botón
      axios.put('https://flexxsign-api.azure-api.net/FlexxSign-Functions/generatepin', data2, config) //En esta función se genera el pin y se envía al usuario por el método seleccionado
        .then((res) => {
          
          setPinMessage('Pin');
          changeVis('hidden');

          setFormVisible('visible');
          setinputdisabled(false);

          setButtonText("A pin has been sent, please introduce it in the box to reset your password");
          setMessage("");
          pinsent = true;
          // Ahora debe aparecer un cuadro de texto donde introducir el pin
          userverified = false;
          settextorangebutton("Reset Password");
          // Desactivamos el userverified por posibles problemas

        }, (error) => {
          //setButtonText('An error has occurred, please refresh the page and try again');
          setPinMessage('Pin');
          changeVis('hidden');

          setFormVisible('visible');
          setButtonText("A pin has been sent, please introduce it in the box to reset your password");
          setMessage("");
          setinputdisabled(false);
          pinsent = true;
          // Ahora debe aparecer un cuadro de texto donde introducir el pin
          userverified = false;
          settextorangebutton("Reset Password");
        });

    }

    else {
      // Primera vez que pulsas el botón
      // If mail does not contain @ or .something, the API returns an error
      if (data.mail.indexOf("@") === -1 || data.mail.indexOf(".") === -1) {
        setButtonText('Please, introduce a valid email');
      }
      else {
        isloading();
        axios.put('https://flexxsign-api.azure-api.net/FlexxSign-Functions/checkuser', data, config)
          .then((res) => {
            console.log(res);
            try {
              if (res.data === "Yes") {
                // Wait until the loading is finished
                setTimeout(() => {
                  // Ask the api for the reset possible options
                  axios.post('https://flexxsign-api.azure-api.net/FlexxSign-Functions/getmethods', data, config)
                    .then((res) => {
                      console.log(res);
                      if (res.data === "pTel method") {
                        setemailmethod(true);
                        setSelects("pSMS")
                      }
                      else if (res.data === "pJefe method") {
                        settelephonemethod(true);
                      }
                    }, (error) => {
                      
                    });
                  setButtonText("Please, select the reset method");
                  // Verify user changing the boolean
                  userverified = true;
                  setinputdisabled(true);
                  settextorangebutton("Send");
                  changeVis('visible');
                }, 28000);

              }
              // The user exists but it's not allowed to reset the password
              else {
                setTimeout(() => {
                  setButtonText("The response from the server is unexpected, please try again in a few minutes");
                }, 28000);
              }
            }
            // The user does not exist but for security reasons we don't want to show it
            catch (error) {
              setTimeout(() => {
                setButtonText("An error with the server response format has occurred, please try again in a few minutes");
              }, 28000);
            }

          }, (error) => {
            setTimeout(() => {
              setButtonText('An error has occurred, please try again in a few minutes');
            }, 28000); // Debe pasar un tiempo hasta que se hace el display del setbuttonText

          });
      }
    }
  }

  // Determinamos si la pag está cargada o no (isLoading or ispinloading)
  if (loading === true || delay === true) {

    return (
      <div className="App">

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          <form class="login" onSubmit={handleSubmit} method="post">

            <div class="login__field">
              <i class="login__icon fas fa-user"></i>
              <div>
                <input type={primerForm} name="email" class="login__input" onChange={handleChange} value={message} placeholder={pinmessage} autoComplete="off" input disabled={inputdisabled} />
              </div>

              <div>
                <select id="segundoForm" class="login__selector" name="typepins" value={selects} onChange={e => setSelects(e.target.value)}>
                  <option value="pJefe">send PIN to manager's email</option>
                  <option value="pSMS">send PIN by SMS</option>
                </select>
              </div>
              <ReactLoading class="loader" type={"bars"} color={"#ffffff"} height={70} width={37} />
            </div>
          </form>


          <a
            className="App-link"
            href="https://www.flexxible.com"
          >
            {pokeid}
          </a>
          <button class="button login__submit" id="botonCopy" hidden onClick={() => {navigator.clipboard.writeText(this.state.password)}} >
            <span class="button__text" name="submit_btn" > copy </span>
            <i class="button__icon fas fa-chevron-right"></i>
          </button>
          <script src="https://www.google.com/recaptcha/api.js" async defer />
        </header>
      </div>

    )
  }
  else {

    return (

      <div className="App">

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />

          <form class="login" onSubmit={handleSubmit} method="post">

            <div class="login__field">
              <i class="login__icon fas fa-user"></i>
              <div>
                <input type={primerForm} name="email" class="login__input" onChange={handleChange} value={message} placeholder={pinmessage} autoComplete="off" input disabled={inputdisabled} />
              </div>

              <div>
                <select id="segundoForm" class="login__selector" name="typepins" value={selects} onChange={e => setSelects(e.target.value)}>
                  <option value="pJefe" disabled={emailmethod} >send PIN to manager's email</option>
                  <option value="pSMS" disabled={telephonemethod}>send PIN by SMS</option>
                </select>
              </div>
              <div>
                <button class="button login__submit" onClick={SendRequest} disabled={butondiabled}>
                  <span class="button__text" name="submit_btn" > {textorangebutton} </span>
                  <i class="button__icon fas fa-chevron-right"></i>
                </button>
              </div>
            </div>

            
          </form>


          <a
            className="App-link"
            href="https://www.flexxible.com"
          >
            {pokeid}
          </a>
          <button class="login__submit_2" id="botonCopy"  onClick={() => {navigator.clipboard.writeText(password)}} >
            <span class="button__text" name="submit_btn" > Copy to clipboard </span>
            <i class="button__icon fas fa-chevron-right"></i>
          </button>
            
          
          <script src="https://www.google.com/recaptcha/api.js" async defer />
        </header>
      </div>
    );
  }
}


export default App;
