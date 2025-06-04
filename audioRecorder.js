let mediaRecorder;
let audioChunks = [];

// Start recording when the button is clicked
document.getElementById('startRecording').addEventListener('click', async () => {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
  mediaRecorder = new MediaRecorder(stream);
  
  mediaRecorder.ondataavailable = event => {
    audioChunks.push(event.data);
  };
  
  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
    const audioUrl = URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    
    // Enable send button when recording is finished
    document.getElementById('sendAudio').disabled = false;
    
    // To listen to the recorded audio
    audio.play();
    
    // Save the Blob in case you want to use it for upload
    window.audioBlob = audioBlob;
  };
  
  mediaRecorder.start();
  document.getElementById('stopRecording').disabled = false;
  document.getElementById('startRecording').disabled = true;
});

// Stop recording when the button is clicked
document.getElementById('stopRecording').addEventListener('click', () => {
  mediaRecorder.stop();
  document.getElementById('stopRecording').disabled = true;
});

// Send the recorded audio to the backend
document.getElementById('sendAudio').addEventListener('click', () => {
  const formData = new FormData();
  formData.append('audio', window.audioBlob, 'recorded-audio.wav');
  
  // Send audio as FormData (you can change the endpoint URL as required)
  fetch('/upload-audio', {
    method: 'POST',
    body: formData,
  })
  .then(response => response.json())
  .then(data => {
    console.log('Audio uploaded successfully:', data);
  })
  .catch(error => {
    console.error('Error uploading audio:', error);
  });
});
