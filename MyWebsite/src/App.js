import './App.css';
import Contact from './Contact';
import Projects from './Projects';
import Resume from './Resume';
import image from './me.jpg';
import { Nav, NavLink, NavMenu } from './NavBarElements';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";


function App() {
  return (
    <Router>
      <div className="App">
        <Nav>
          <NavLink to="/">
            Home
          </NavLink>
          <NavMenu>
            <NavLink to="/projects">
              Projects
            </NavLink>
            <NavLink to="/resume">
              Resume
            </NavLink>
            <NavLink to="/contact">
              Contact
            </NavLink>
          </NavMenu>
        </Nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/resume" element={<Resume />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </div>
    </Router>
  );
}

function Home() {
  return (
    <header className="App-header">
   <div class="typewriter">
   <h1 style={{ fontSize: '1.5rem' , marginLeft: '115px'}}>console.log(<strong>"Welcome"</strong>);</h1>
</div>
      <img src={image} alt="me" className="diagonal-image" />
      <div class="typewriter">
  <h1 style={{ fontSize: '1.5rem' , marginLeft: '140px'}}>console.log(<strong>"A little about me..."</strong>);</h1>


<h1 style={{paddingTop: '100px', paddingLeft:'310px', fontSize: '15px', fontFamily: 'Cursive'}}> As a recent graduate from the University of Guelph with a <br></br>Bachelor's degree in Computing, I have developed a deep <br></br>appreciation for the challenges and rewards that come with <br></br>being a computer scientist. Through the highs and lows of <br></br>this dynamic field, I have come to embrace the passion and <br></br> dedication that is necessary to succeed in creating <br></br>innovative solutions.</h1>
<h1 style={{paddingTop: '30px', paddingLeft:'310px', fontSize: '15px', fontFamily: 'Cursive'}}> My passion for software development and application design <br></br>is fueled by the joy of creating tools that are both <br></br>functional and fun for users. As an experienced developer,<br></br> I take pride in crafting applications that not only enhance <br></br> user experiences, but also improve their efficiency and <br></br> simplify their daily lives.</h1>
<h1 style={{paddingTop: '30px', paddingLeft: '310px' , fontSize: '15px', fontFamily: 'Cursive'}}> I invite you to explore my portfolio, where you can <br></br>discover some of the exciting projects that I have been <br></br>fortunate enough to be a part of and create. Whether you <br></br>are a fellow computer scientist or simply someone who is <br></br>interested in learning more about my work, I encourage you <br></br>to interact with my site and engage with me on this <br></br>thrilling journey.</h1>

</div>
<hr style={{ border: '0', height: '2px', background: 'white', width: '500px', marginLeft: '350px', marginTop: '50px'}} />

    </header>
  );
}

export default App;
