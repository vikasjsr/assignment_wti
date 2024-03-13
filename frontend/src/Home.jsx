import React, { useState, useEffect } from "react";

const Home = () => {
  const [firstname, setFirstName] = useState("");
  const [lastname, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [clients, setClients] = useState([]);
  const [editingClientId, setEditingClientId] = useState(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch("http://localhost:4000/getalluser");
      const data = await response.json();
      setClients(data.users);
    } catch (error) {
      console.error("Error fetching clients:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: firstname,
          lastName: lastname,
          email: email,
          mobile: mobile,
        }),
      });

      if (response.ok) {
        fetchClients(); // Refresh the client list after adding a new client
        setFirstName("");
        setLastName("");
        setEmail("");
        setMobile("");
      } else {
        console.error("Failed to add client:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding client:", error);
    }
  };

  const handleEdit = (clientId) => {
    setEditingClientId(clientId);
    const clientToEdit = clients.find((client) => client._id === clientId);
    if (clientToEdit) {
      setFirstName(clientToEdit.firstName);
      setLastName(clientToEdit.lastName);
      setEmail(clientToEdit.email);
      setMobile(clientToEdit.mobile);
    }
  };

  const handleSaveEdit = async () => {
    try {
      const response = await fetch(
        `http://localhost:4000/update/${editingClientId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: firstname,
            lastName: lastname,
            email: email,
            mobile: mobile,
          }),
        }
      );

      if (response.ok) {
        fetchClients(); // Refresh the client list after editing a client
        setFirstName("");
        setLastName("");
        setEmail("");
        setMobile("");
        setEditingClientId(null);
      } else {
        console.error("Failed to edit client:", response.statusText);
      }
    } catch (error) {
      console.error("Error editing client:", error);
    }
  };

  const handleDelete = async (clientId) => {
    try {
      const response = await fetch(`http://localhost:4000/delete/${clientId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchClients(); // Refresh the client list after deleting a client
      } else {
        console.error("Failed to delete client:", response.statusText);
      }
    } catch (error) {
      console.error("Error deleting client:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="fname">First name:</label>
        <br />
        <input
          type="text"
          id="fname"
          name="fname"
          value={firstname}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <br />
        <label htmlFor="lname">Last name:</label>
        <br />
        <input
          type="text"
          id="lname"
          name="lname"
          value={lastname}
          onChange={(e) => setLastName(e.target.value)}
        />
        <br />
        <label htmlFor="email">Email:</label>
        <br />
        <input
          type="text"
          id="email"
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <label htmlFor="mobile">Mobile:</label>
        <br />
        <input
          type="text"
          id="mobile"
          name="mobile"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
        />
        <br />
        {editingClientId ? (
          <button onClick={handleSaveEdit}>Save Edit</button>
        ) : (
          <button type="submit">Submit</button>
        )}
      </form>
      <div style={{ display: "flex", justifyContent: "space-evenly" }}>
        {clients.map((client) => (
          <div key={client._id}>
            <p>
              Name: {client.firstName} {client.lastName}
            </p>
            <p>Email: {client.email}</p>
            <p>Mobile: {client.mobile}</p>
            <button onClick={() => handleEdit(client._id)}>Edit</button>
            <button onClick={() => handleDelete(client._id)}>Delete</button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Home;
