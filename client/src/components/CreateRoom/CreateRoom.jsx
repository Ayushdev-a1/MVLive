import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: #1a1a1a;
  color: white;
`;

const Input = styled.input`
  padding: 10px;
  font-size: 1.2rem;
  margin: 10px;
  border-radius: 5px;
  border: none;
  width: 250px;
  text-align: center;
`;

const Button = styled.button`
  padding: 12px 20px;
  background: #f05454;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: background 0.3s;
  margin-top: 10px;

  &:hover {
    background: #d43f3f;
  }
`;

const LinkBox = styled.div`
  margin-top: 20px;
  padding: 10px;
  background: #444;
  border-radius: 5px;
  font-size: 1rem;
  word-wrap: break-word;
`;

export default function CreateRoom() {
  const [roomName, setRoomName] = useState("");
  const [description, setDescription] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [shareableLink, setShareableLink] = useState(null);
  const navigate = useNavigate();
  const {user} = useAuth();


  const handleCreateRoom = async () => {
    console.log(user?.googleId)
    if (!roomName.trim()) {
      console.log("Room name cannot be empty")
      toast.error("Room name cannot be empty");
      return;
    }


    // if (!token) {
    //   console.log("nhi chl rha h")
    //   toast.error("Please log in first");
    //   return;
    // }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/rooms/",
        { 
          name: roomName,
          description: description,
          isPrivate: isPrivate,
        },
        {
          headers: {Authorization: user?.googleId},
          withCredentials: true,
        }
      );
      console.log(res)
      setShareableLink(res.data.data.shareableLink);
      toast.success("🎉 Room Created Successfully!");
      console.log("Navigating to /rooms");
    } catch (error) {
      console.error(error);
    } 
  };

  return (
    <Container>
      <h2>Create a Room</h2>
      <Input
        type="text"
        id="roomName"
        name="roomName"
        placeholder="Enter room name"
        value={roomName}
        onChange={(e) => setRoomName(e.target.value)}
      />
      <Input
        type="text"
        id="description"
        name="description"
        placeholder="Enter room description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <label>
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
        />
        Private Room
      </label>
      <Button onClick={handleCreateRoom}>Create Room</Button>

      {shareableLink && (
        <>
          <h3>Invite Friends:</h3>
          <LinkBox>{shareableLink}</LinkBox>
        </>
      )}
    </Container>
  );
}