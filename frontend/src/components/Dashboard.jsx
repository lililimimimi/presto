import { Routes, Route, BrowserRouter, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import MediaCard from "./MediaCard";
import BasicModal from "./Modal";

const Dashboard =()=>{
    return (
      <>
        <BasicModal />
        <MediaCard />
      </>
    );
}

export default Dashboard;