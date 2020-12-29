import React from "react";
import { css } from "@emotion/core";
import ClipLoader from "react-spinners/ClipLoader";
import Loader from "react-spinners/PropagateLoader";
 
// Can be a string as well. Need to ensure each key-value pair ends with ;
const override = css`
  display: block;
  margin: 1rem auto;
  height: 1rem;
  width: 1rem;
  opacity: 1;

`;
 
class PropagateLoader extends React.Component {
  render() {
    return (
      <div className="sweet-loading">
        <Loader
          css={override}
          size={15}
           color={"#ffffff"}
        //   color={"#5B6BE7"}
          loading={true}
        />
      </div>
    );
  }
}

export default PropagateLoader;