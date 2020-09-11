import React, {useCallback} from 'react';
import './App.css';
import {useDropzone} from 'react-dropzone';
import superagent from 'superagent';

function App() {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    acceptedFiles.forEach(file => {
      superagent.post(`http://localhost:8080/upload/${file.name}`)
      .send(file).end(function (err, res) {
        console.log(err, res);
      })
      console.log(file);
    })
  }, [])
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({onDrop});

  const files = acceptedFiles.map(file => (
      <li key={file.name}>
        {file.name} - {file.size} bytes
      </li>
  ));


  return (
      <div className="App">
        <section className="container">
          <div {...getRootProps({className: 'dropzone'})}>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </div>
          <aside>
            <h4>Files</h4>
            <ul>{files}</ul>
          </aside>
        </section>
      </div>
  );

  // return (
  //   <div className="App">
  //     <header className="App-header">
  //
  //       <img src={logo} className="App-logo" alt="logo" />
  //       <p>
  //         Edit <code>src/App.tsx</code> and save to reload.
  //       </p>
  //       <a
  //         className="App-link"
  //         href="https://reactjs.org"
  //         target="_blank"
  //         rel="noopener noreferrer"
  //       >
  //         Learn React
  //       </a>
  //     </header>
  //   </div>
  // );
}

export default App;
