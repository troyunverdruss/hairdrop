import React, {useState} from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import {FaCheckCircle, FaExternalLinkAlt} from "react-icons/fa";
import "./TextEntry/TextEntry.css"

export interface Entry {
  id: number;
  type: "FILE" | "TEXT";
  data: string;
  created: string;
}

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
      <span className="rowEntry">
        {entry.data}{" "}
        {visible && (
            <FaCheckCircle className="checkmark" visibility={visible ? "" : "hidden"}/>
        )}
        <a href={entry.data}>
          <FaExternalLinkAlt className="link" />
        </a>
      </span>
      </CopyToClipboard>
  );
};
