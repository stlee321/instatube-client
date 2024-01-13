import { isRouteErrorResponse, useRouteError } from "react-router-dom";

export default function RootError() {
  const error = useRouteError();
  if (isRouteErrorResponse(error)) {
    return (
      <>
        <div>{error.status}</div>
      </>
    );
  }
  return <div>error</div>;
}
