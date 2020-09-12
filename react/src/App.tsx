import React, { useCallback, useEffect, useState } from "react";
import "./App.css";
import { useDropzone } from "react-dropzone";
import superagent from "superagent";
import CopyToClipboard from "react-copy-to-clipboard";
import { FaCheckCircle, FaExternalLinkAlt } from "react-icons/fa";

const remote_url = "http://10.41.33.2/hairdrop";

interface Entry {
  id: number;
  type: "FILE" | "TEXT";
  data: string;
  created: string;
}

const TextEntry = (entry: Entry) => {
  const [visible, setVisible] = useState(false);

  const onCopy = () => {
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 2000);
  };

  return (
    <CopyToClipboard text={entry.data} onCopy={onCopy}>
      <span>
        {entry.data}{" "}
        {visible && (
          <FaCheckCircle style={{ color: "green", display: "hidden" }} />
        )}
        <a href={entry.data}>
          <FaExternalLinkAlt style={{ color: "grey" }} />
        </a>
      </span>
    </CopyToClipboard>
  );
};

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
        <li key={e.id}>
          <a href={`${remote_url}/file/${e.data}`}>{e.data}</a>
        </li>
      );
    } else {
      body = (
        <li key={e.id}>
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
        <ul>{entries && entries.map((e) => <DisplayEntry {...e} />)}</ul>
      </section>
    </div>
  );
}

export default App;
