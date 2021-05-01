import {Entry} from "./Entry";
import {remote_url} from "../App";
import React from "react";

export const DownloadEntry = (entry: Entry) => {
  return (
      <div className="rowContainer">
        <div className="rowEntry">
          <a href={`${remote_url}/file/${entry.data}`}>{entry.data}</a>
        </div>
      </div>
  )
}
