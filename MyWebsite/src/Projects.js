import React, { useState } from 'react';
import './Project.css';
import { faSeedling, faChess, faOm, faComputer, faTerminal } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

function Projects() {
  const [card1Open, setCard1Open] = useState(false);
  const [card2Open, setCard2Open] = useState(false);
  const [card3Open, setCard3Open] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const toggleCard1 = () => {
    setCard1Open(!card1Open);
    const popup = document.querySelector('.popup');
    if (popup) {
      popup.classList.toggle('show');
    }
  };

  const toggleCard2 = () => {
    setCard2Open(!card2Open);
  };

  const toggleCard3 = () => {
    setCard3Open(!card3Open);
  };

  const handleInputSubmission = () => {
    console.log(inputValue); // Replace with your code to save the input value to a database or perform other actions
    // Additional logic can be added here, such as clearing the input field or updating state
  };

  return (
    <div>
      <div style={{ backgroundColor: '#31363f', minHeight: '5vh' }}>
        <div style={{ padding: '40px 0' }}>
          <div className="typewriter">
            <h1 style={{ fontSize: '2rem', marginLeft: '-125px' }}>Projects</h1>
          </div>

          <div className="card-container2">
            <div className="card2" onClick={toggleCard1}>
              <FontAwesomeIcon icon={faOm} size="3x" style={{ padding: '70px', paddingLeft: '66px' }} />
            </div>

            <div className="card2" onClick={toggleCard2}>
              <FontAwesomeIcon icon={faSeedling} size="3x" style={{ padding: '74px', paddingLeft: '36%' }} />
              {card2Open && <div className="card-content"></div>}
            </div>

            <div className="card2" onClick={toggleCard3}>
              <FontAwesomeIcon icon={faChess} size="3x" style={{ padding: '70px', paddingLeft: '33%' }} />
              {card3Open && <div className="card-content"></div>}
            </div>

            <div className="card2" onClick={toggleCard3}>
              <FontAwesomeIcon icon={faComputer} size="3x" style={{ padding: '80px', paddingLeft: '39%' }} />
              {card3Open && <div className="card-content"></div>}
            </div>

            <div className="card2" onClick={toggleCard3}>
              <FontAwesomeIcon icon={faTerminal} size="2x" style={{ padding: '85px', paddingLeft: '50%' }} />
              {card3Open && <div className="card-content"></div>}
            </div>

            {card1Open && (
              <div className="popup-container">
                <div className="popup">This is the popup box content.</div>
              </div>
            )}
            {card2Open && (
              <div className="popup-container">
                <div className="popup">This is the popup box content.</div>
              </div>
            )}
            {card3Open && (
              <div className="popup-container">
                <div className="popup">This is the popup box content.</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ backgroundColor: '#31363f', minHeight: '5vh' }}>
          <div style={{ padding: '40px 0', marginTop: '-130px' }}>
            <hr style={{ border: '0', height: '2px', background: 'white' }} />

            <div className="typewriter">
              <h1 style={{ fontSize: '2rem', marginTop: '60px' }}>Upcoming Projects</h1>
            </div>
          </div>
        </div>
        <div class="container">
          <div class="box" style={{ fontSize: '1rem', marginBottom: '-37px' }}>
            <div class="content">
              <div class="title" style={{ fontSize: '1rem', marginTop: '-140px' }}>
                Box 1
              </div>
              <div style={{ height: '200px', marginTop: '20px' }}>
                <h1>Project 1</h1>
                <p>Test test test test test</p>
              </div>
            </div>
          </div>

          <div class="box" style={{ fontSize: '1rem', marginTop: '80px' }}>
            <div class="content">
              <div class="title" style={{ fontSize: '1rem', marginTop: '-140px' }}>
                Box 1
              </div>
              <div style={{ height: '200px', marginTop: '20px' }}>
                <h1>Project 2</h1>
                <p>Test test test test test</p>
              </div>
            </div>
          </div>

          <div class="box" style={{ fontSize: '1rem', marginTop: '80px' }}>
            <div class="content">
              <div class="title" style={{ fontSize: '1rem', marginTop: '-140px' }}>
                Box 1
              </div>
              <div style={{ height: '200px', marginTop: '20px' }}>
                <h1>Project 3 </h1>
                <p>Test test test test test</p>
              </div>
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: 'white', minHeight: '10vh', marginTop: '-220px' }}>
          <div style={{ padding: '20px 0' }}></div>
          <div style={{ marginTop: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '0px', backgroundColor: 'white' }}>
            <input
              type="text"
              placeholder="Got any project ideas?"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              style={{
                padding: '10px',
                fontSize: '18px',
                borderRadius: '20px',
                border: '2px solid #ccc',
                marginBottom: '20px',
                width: '400px',
                textAlign: 'center',
                color: 'black',
              }}
            />
            <button
              onClick={handleInputSubmission}
              style={{
                padding: '10px 20px',
                fontSize: '18px',
                borderRadius: '5px',
                backgroundColor: '#31363f',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
                marginBottom: '10px',
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Projects;
