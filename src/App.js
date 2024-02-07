
import { Route, Routes } from 'react-router-dom';
import './App.css';
import Login from './Components/Common/Login';
import SignUp from './Components/Common/SignUp';
import BrainTumor from './Components/Core/Disease/BrainTumor';
import DiseasePredictor from './Components/Core/Disease/DiseasePredictor';
import Contributor from './Components/Core/Contributor';
import { Home } from './Components/Core/Home';

function App() {
  return (
    <div className="App">
      
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/detection/brain' element={<BrainTumor/>}/>
        <Route path='/detection/diseasepredictor' element={<DiseasePredictor/>}/>
        <Route path='/contributor' element={<Contributor/>}/>
      </Routes>
    </div>
  );
}

export default App;