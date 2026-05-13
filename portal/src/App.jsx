import React from "react";
import { BrowserRouter } from "react-router-dom";
import MechanicRoutes from "./routes/MechanicRoutes";

const App = () => {
  return (
    <BrowserRouter>
      <MechanicRoutes />
    </BrowserRouter>
  );
};

export default App;
