import styles from '../styles/Home.module.css'
import { useState, useEffect } from 'react';
import { TextField, Button, List, ListItem, Container } from '@mui/material';


const MyApp = () => {
  const [message, setMessage] = useState('');
  const [msgLog, setMsgLog] = useState([])
  const [history, setHistory] = useState([]);


  const handleMessageChange = (e) => {
    setMessage(e.target.value);
  };

  async function handleSubmit (e) {
    e.preventDefault();
    setMsgLog([...msgLog, message]);
    const data = await fetch('http://0.0.0.0:3000/api/chat', {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({message:message}),
      redirect:'follow'
    })
      .then(data => data.json())
      .catch(err => console.log(err));
    console.log(data, 'ablca')
    setHistory([...history, data.message]);
    setMessage('');
  };
  return (
    <Container>
      <form onSubmit={handleSubmit}>
        <TextField 
          value={message}
          onChange={handleMessageChange}
          placeholder="Type your message..."
          fullWidth
        />
        <Button type="submit">Send</Button>
      </form>
      <List>
        {history.map((msg, index) => (
          <div>
            <div style={{margin:'10px', backgroundColor:'#d3d3d3', borderRadius:'5px'}}>
              <ListItem key={index.toString().concat('U')}>{'您:'.concat(msgLog[index])}</ListItem> 
            </div>
            <div style={{margin:'10px', backgroundColor:'#b5eef5', borderRadius:'5px'}}>
              <ListItem key={index.toString().concat('G')}>{'GPT:'.concat(msg)}</ListItem>
            </div>
          </div>
        ))}
      </List>
    </Container>
  );

};
export default MyApp;
