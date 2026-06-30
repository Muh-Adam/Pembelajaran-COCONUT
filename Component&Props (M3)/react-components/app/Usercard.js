import React from "react";

export default function UserCard({ name, umur }) {
    return (
        <>
            <h3>Nama : {name}</h3>
            <h3>Umur : {umur}</h3>
        </>
    )
}