import React from 'react';
import Select from 'react-select';
import '../App.css';
import {  useNavigate } from 'react-router-dom';

const Compilernav = ({userLang, setUserLang, userTheme,
				setUserTheme, fontSize, setFontSize}) => {
	const languages = [
		{ value: "c", label: "C" },
		{ value: "cpp", label: "C++" },
		{ value: "python", label: "Python" },
		{ value: "java", label: "Java" },
	];
	const themes = [
		{ value: "vs-dark", label: "Dark" },
		{ value: "light", label: "Light" },
	]
    let navigate=useNavigate();
	return (
		<div className="navbar" >
            <div className="navsec">
                    <h3>IPrep IDE</h3>
                    <button className='btn btn-primary compilerBtn' onClick={()=>{
                        navigate('/');
                    }}> Home </button>
                   {localStorage.getItem('token') && <button className='btn btn-primary compilerBtn' onClick={()=>{
                        navigate('/sender')
						
                    }}>Sender meet</button> }
                   {localStorage.getItem('token') &&  <button className='btn btn-primary compilerBtn' onClick={()=>{
                        navigate('/receiver');
						
                    }}>Receiver meet</button>}
            </div>
			<Select options={languages} className='select-sec' value={userLang}
					onChange={(e) => setUserLang(e.value)}
					placeholder={userLang} />
			<Select options={themes} className='select-sec' value={userTheme}
					onChange={(e) => setUserTheme(e.value)}
					placeholder={userTheme} />
			<label>Font Size</label>
			<input type="range" min="18" max="30"
				value={fontSize} step="2"
				onChange={(e) => { setFontSize(e.target.value)}}/>
		</div>
	)
}
export default Compilernav
