// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";


function MyApp() {
  const [characters, setCharacters] = useState([]);


  function removeOneCharacter(index) {
    const characterToRemove = characters[index];
    const deleteUrl = `http://localhost:8000/users/${characterToRemove.id}`;
  
    fetch(deleteUrl, { method: 'DELETE' })
      .then((res) => {
        console.log(res.status)
        if (res.status === 204) {
          const updated = characters.filter((character, i) => i !== index);
          setCharacters(updated);
        } else if (res.status === 404) {
          throw new Error("Resource not found.");
        }
      })
      .catch((error) => {
        console.log("Error deleting character: ", error);
      });
  }

  function updateList(person) {
    postUser(person)
      .then((res) => {
        if (res.status != 201) {
          throw new Error("Failed post");
        }
        return res.json();
      
      })
      .then((newUser) => {
        setCharacters([...characters, newUser]);
        console.log(newUser);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(person)
    });
  
    return promise;
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json["users_list"]))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div className="container">
      <Table
        characterData={characters}
        removeCharacter={removeOneCharacter}
      />
      <Form handleSubmit={updateList} />
    </div>
  );
}

export default MyApp;
