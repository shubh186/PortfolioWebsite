import './App.css';
import image2 from './resume.jpg';
import resumePDF from './resume.pdf';

function Resume() {
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

  return (
    <div style={{ backgroundColor: '#31363f', minHeight: '5vh' }}>
      <div style={{ padding: '20px 0' }}></div>
      <div class="image-container">
        <a href={resumePDF} download = 'Shubh Joshi - Resume'>
          <img src={image2} alt="resume" className="bouncy"/>
        </a>
        <h1 style={{color: 'white', fontSize: '12px', }}>Click to download!</h1>
      </div>
  
      <div style={{ backgroundColor: 'white', minHeight: '10vh', marginTop: '175px' }}>
        <div style={{ padding: '20px 0' }}></div>
        <div style={{ marginTop: '-60px', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '50px' , backgroundColor: 'white'}}>
          <input type="text"  placeholder="Got any resume suggestions?"  onKeyDown={handleKeyDown} style={{ padding: '10px', fontSize: '18px', borderRadius: '20px', border: '2px solid #ccc', marginBottom: '20px', width: '400px', textAlign: 'center', color: 'black' }} />
          <button onClick={handleInputSubmission} style={{ padding: '10px 20px', fontSize: '18px', borderRadius: '5px', backgroundColor: '#31363f', color: '#fff', border: 'none', cursor: 'pointer', marginBottom: '10px'}}>Submit</button>
        </div>
      </div>
    </div>
  );
}

export default Resume;
