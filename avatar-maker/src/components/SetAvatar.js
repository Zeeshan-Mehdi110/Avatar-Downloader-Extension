import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import axios from 'axios';
import { Box, Button } from '@mui/material';
import loader from '../assets/loader.gif';
import DownloadIcon from '@mui/icons-material/Download';
import SyncIcon from '@mui/icons-material/Sync';
import { saveAs } from 'file-saver';
import "../App.css";

const SetAvatar = () => {
  const api = `https://api.multiavatar.com/4645646`;
  const [avatars, setAvatars] = useState([]);
  const [isLoading, setIsLoading] = useState(null);
  const [selectedAvatar, setSelectedAvatar] = useState(undefined);
  const [message, setMessage] = useState(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const data = [];
      for (let i = 0; i < 4; i++) {
        const response = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`);
        const buffer = Buffer.from(response.data);
        data.push(buffer.toString('base64'));
      }
      setAvatars(data);
      setIsLoading(false);
    } catch (error) {
      // Handle any errors that occur during the fetch
      console.error(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const downloadImage = async () => {
    if (selectedAvatar !== undefined) {
      const base64Image = avatars[selectedAvatar];
      const blob = new Blob([Buffer.from(base64Image, 'base64')], { type: 'image/svg+xml' });
      saveAs(blob, 'avatar.svg');
    } else {
      const message = 'Please select an avatar';
      setMessage(message);
    }
  };


  const handleRefresh = () => {
    fetchData();
    setSelectedAvatar(undefined);
    setMessage(null);
  };

  return (
    <Box display="flex" justifyContent="center" textAlign="center" alignItems="center">
      {isLoading ? (
        <Box>
          <img src={loader} alt="loader" width="200px" />
        </Box>
      ) : (
        <Box>
          <h2>Pick an Avatar and download now 😍 !! </h2>
          <Box>
            {avatars.map((avatar, index) => {
              return (
                <Box key={index}>
                  <img
                    className={`${selectedAvatar === index ? 'selected' : ''}`}
                    width="200px"
                    height="100px"
                    src={`data:image/svg+xml;base64,${avatar}`}
                    alt="avatar"
                    onClick={() => setSelectedAvatar(index)}
                  />
                </Box>
              );
            })}
          </Box>
          {message && <h3>{message}</h3>}
          <Button
            onClick={downloadImage}
            size="small"
            color="success"
            variant="contained"
            sx={{ marginTop: '16px', marginRight: '12px' }}
            startIcon={<DownloadIcon />}
          >
            Download
          </Button>
          <Button
            onClick={handleRefresh}
            size="small"
            color="success"
            variant="contained"
            sx={{ marginTop: '16px' }}
            startIcon={<SyncIcon />}
          >
            Refresh
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default SetAvatar;
