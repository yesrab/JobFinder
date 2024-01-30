import React from "react";
import { useRouteError } from "react-router-dom";
function Error() {
  let error = useRouteError();
  console.log(error);
  return (
    <div className='ErrorPage'>
      <h1>Error Page not found</h1>
      <p>Reason:</p>
      <p>{error.message}</p>
    </div>
  );
}

export default Error;
