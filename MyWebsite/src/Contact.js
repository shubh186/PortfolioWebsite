import { useState } from 'react';
import './Contact.css';
import { FaLinkedin, FaTwitter, FaEnvelope } from 'react-icons/fa';


function Contact() {
    const [card1Open, setCard1Open] = useState(false);
    const [card2Open, setCard2Open] = useState(false);
    const [card3Open, setCard3Open] = useState(false);
    const [card4Open, setCard4Open] = useState(false);
    const [card5Open, setCard5Open] = useState(false);

  
    const toggleCard1 = () => {
      setCard1Open(!card1Open);
    };
  
    const toggleCard2 = () => {
      setCard2Open(!card2Open);
    };
  
    const toggleCard3 = () => {
      setCard3Open(!card3Open);
    };
    
    const toggleCard4 = () => {
      setCard4Open(!card4Open);
    };
  
    const toggleCard5 = () => {
      setCard5Open(!card5Open);
    };
  
  
    return (
      
      <div style={{ backgroundColor: '#31363f', minHeight: '5vh' }}>
    <div style={{ padding: '90px 0' }}>
    
        </div>
        
        <div className='icon-container'>
        <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" >
            <FaTwitter size={37} color= '#1DA1F2' className="bouncy" />
          </a>
          <span className="icon-separator"></span>
          
          <a href="https://www.linkedin.com/" target="_blank" rel="noopener noreferrer">
            <FaLinkedin size={37} color="#0A66C2" className="bouncy" />
          </a>
          
          <span className="icon-separator"></span>
          <a href="mailto:shubh.joshi@gmail.com">
            <FaEnvelope size={37} color= "#1DA1F2" className="bouncy" />
          </a>
        </div>
        
        <div className="typewriter" style={{marginTop: '120px'}}>
        <h1 style={{ fontSize: '2rem' , marginLeft: '565px'}}>Area of Expertise</h1>

        </div>
  
        <div className="card-container">
          <div className="card" onClick={toggleCard1}>
            <h2 style={{fontSize:'16px', marginTop: '25px', color: 'white'}}>Front-end Development</h2>
            {card1Open && (
              <p style={{marginTop: '-5px', fontWeight: 'bold', fontStyle: 'oblique', color: 'black'}}>ExLv: 4yrs</p>
            )}
          </div>
   
          <div className="card" onClick={toggleCard2}>
            <h2 style={{fontSize:'16px', marginTop: '25px', color: 'white'}}>Back-end Development</h2>
            {card2Open && (
              <p style={{marginTop: '-5px', fontWeight: 'bold', fontStyle: 'oblique', color: 'black'}}>ExLv: 4yrs</p>
              )}
          </div>
  
          <div className="card" onClick={toggleCard3}>
            <h2 style={{fontSize:'16px', marginTop: '25px', color: 'white'}}>Cloud Development</h2>
            {card3Open && (
              <p style={{marginTop: '-5px', fontWeight: 'bold', fontStyle: 'oblique', color: 'black'}}>ExLv: 4yrs</p>
              )}
          </div>
  
          <div className="card" onClick={toggleCard4}>
            <h2 style={{fontSize:'16px', marginTop: '25px', color: 'white'}}>Database Development</h2>
            {card4Open && (
              <p style={{marginTop: '-5px', fontWeight: 'bold', fontStyle: 'oblique', color: 'black'}}>ExLv: 4yrs</p>
              )}
          </div>
  
          <div className="card" onClick={toggleCard5}>
            <h2 style={{fontSize:'16px', marginTop: '25px', color: 'white'}}>Application Development</h2>
            {card5Open && (
              <p style={{marginTop: '-5px', fontWeight: 'bold', fontStyle: 'oblique', color: 'black'}}>ExLv: 4yrs</p>
              )}
          </div>
        </div>
        <div style={{ marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px' , backgroundColor: 'white'}}>
          <input type="text"  placeholder="Got any feedback?"  onKeyDown={handleKeyDown} style={{ padding: '10px', fontSize: '18px', borderRadius: '20px', border: '2px solid #ccc', marginBottom: '20px', width: '400px', textAlign: 'center', color: 'black' }} />
            <button onClick={handleInputSubmission} style={{ padding: '10px 20px', fontSize: '18px', borderRadius: '5px', backgroundColor: '#31363f', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: '10px'}}>Submit</button>
          
          </div>
          

      </div>
    );
}

function handleInputSubmission(event) {
    
  event.preventDefault();
  const inputValue = event.target.previousSibling.value;
  console.log(inputValue); // replace this with your code to save the input value to a database
}

function handleKeyDown(event) {
  if (event && event.key === 'Enter') {
    handleInputSubmission();
  }
}
export default Contact;
