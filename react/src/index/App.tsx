import React, {useCallback, useEffect, useState} from "react";
import "./App/App.css";
import {useDropzone} from "react-dropzone";
import superagent from "superagent";
import {TextEntry} from "./App/TextEntry";
import {Entry} from "./App/Entry";
import {DownloadEntry} from "./App/DownloadEntry";

export const remote_url = "http://10.41.33.2/hairdrop-server";

function App() {
  const [entries, setEntries] = useState(new Array<Entry>());

  const onDrop = useCallback((acceptedFiles: File[]) => {
    // Do something with the files
    acceptedFiles.forEach((file) => {
      superagent
        .post(`${remote_url}/upload/${file.name}`)
        .send(file)
        .end(function (err, res) {
          loadData();
          console.log(err, res);
        });
    });
  }, []);
  const { acceptedFiles, getRootProps, getInputProps } = useDropzone({
    onDrop,
  });

  const files = acceptedFiles.map((file) => (
    <li key={file.name}>
      {file.name} - {file.size} bytes
    </li>
  ));

  const [data, setData] = useState("");

  const saveData = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    console.log("save");
    if (data) {
      superagent
        .post(`${remote_url}/entry`)
        .send({ data: data })
        .end(function (err, res) {
          console.log(err, res);
          loadData();
          setData("");
        });
    }
  };

  const loadData = () => {
    superagent
      .get(`${remote_url}/entries`)
      .then((res) => {
        setEntries(res.body);
        console.log(res.body);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    loadData();
  }, [setEntries]);

  const DisplayEntry = (e: Entry) => {
    let body;
    if (e.type === "FILE") {
      body = (
        <li key={e.id} className="display-entry-li">
          <DownloadEntry {...e} />
        </li>
      );
    } else {
      body = (
        <li key={e.id} className="display-entry-li">
          <TextEntry {...e} />
        </li>
      );
    }
    return <>{body}</>;
  };

  return (
    <div className="App">
      <section className="container">
        <div {...getRootProps({ className: "dropzone" })}>
          <form>
            <input {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
          </form>
        </div>
      </section>
      <section>
        <form>
          <input
            type="text"
            value={data}
            onChange={(e) => setData(e.target.value)}
          />
          <br />
          <button onClick={(e) => saveData(e)}>Save</button>
        </form>
      </section>
      <section>
        <ul className="display-entry-ul">{entries && entries.map((e) => <DisplayEntry key={e.id} {...e} />)}</ul>
      </section>
    </div>
  );
}

export default App;
