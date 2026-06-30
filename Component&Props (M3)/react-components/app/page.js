import React from "react";
import UserCard from "./Usercard";


export default function Home() {
  return (
    <>
    <h1 className="text-3xl font-bold text-center">User Card</h1>
    <UserCard name="orang" />
    <UserCard umur={18} />
    </>

  );
}
