import logo from './flexlogo.svg';
import './App.css';
import axios from 'axios';
import React, { useState } from 'react';





async function handleSubmit (event) {
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
  
  async function changeVis(type) {
    
    var segundoForm = document.getElementById('segundoForm');
    var captcha = document.getElementById('captcha');
    segundoForm.style.visibility = type;
    captcha.style.visibility = 'hidden';
  }
  async function SendRequest (event) {
    const token = "2f8f065441ae4a80ab23f6b3cd9837b4" // Azure API Management subscription key
    event.preventDefault();
    console.log("res");
    //axios.get('https://testpasswordfunctions.azurewebsites.net/api/HttpTrigger2?clientId=apim-testpasswordAPI'),
  
    const data = {
      mail: message
      
    };

    const config = {
      headers:{
        'Ocp-Apim-Subscription-Key': token
      }
    };
  
    axios.post('https://testpasswordapi.azure-api.net/testpasswordfunctions/comprobarusuario',data,config)
    .then((res)=>{
      console.log(res);
      
      if (res.data === 1){
        
        setFormVisible('hidden');
        changeVis('visible');
      }
      else{
        setButtonText("Usuario no verificado, correo no registrado o sin disponibilidad de esta función");
      }
      //setButtonText("Su ID es: "+ res.data);
    },(error) => {
      setButtonText('Usuario no verificado, correo no registrado o sin disponibilidad de esta función');
      setFormVisible('hidden');
      changeVis('visible');
    });
  }


  return (
    <div className="App">
      
      <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <script src=
        "https://www.google.com/recaptcha/api.js" async defer />
        
       
        <form class="login" onSubmit={handleSubmit}  method="post">

        <div class="login__field">
					<i class="login__icon fas fa-user"></i>
					<input type={primerForm} name = "email" class="login__input" onChange={handleChange} value={message} placeholder="Email" />
<<<<<<< HEAD
          <select id="segundoForm" class="login__selector" name="typepins" >
            <option value="volvo">send PIN to manager's email</option>
            <option value="saab">send PIN by SMS</option>
            
=======
          <select id="segundoForm" class="login__selector" name="typepins" onLoad={changeVis('hidden')} >
            <option value="pMan">send PIN to manager's email</option>
            <option value="pSms">send PIN by SMS</option>
>>>>>>> 5665096398467b39fd2123c008b810ce36661545
            
          </select>
				</div>
          
        <div class="login__field">
          <div id="captcha" class="g-recaptcha" data-sitekey="6LeszrQjAAAAAOe0tVYAt-DTNixnqPkbpeWUo9tt"  />
          <button class="button login__submit"  onClick={SendRequest} >
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
