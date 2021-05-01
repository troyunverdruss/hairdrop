import React, {useState} from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import {FaCheckCircle, FaExternalLinkAlt} from "react-icons/fa";
import "./TextEntry/TextEntry.css"
import {Entry} from "./Entry";

export const TextEntry = (entry: Entry) => {
  const [visible, setVisible] = useState(false);

  const onCopy = () => {
    setVisible(true);
    setTimeout(() => {
      setVisible(false);
    }, 2000);
  };

  return (
      <CopyToClipboard text={entry.data} onCopy={onCopy}>
        <div className="rowContainer">
          <div className="rowEntry">
            {entry.data}{" "}
          </div>
          <div className="rowCheckAndLink">
            {visible && (
                <FaCheckCircle className="checkmark" visibility={visible ? "" : "hidden"}/>
            )}
            <a href={entry.data}>
              <FaExternalLinkAlt className="link"/>
            </a>
          </div>
        </div>
      </CopyToClipboard>
  );
};
