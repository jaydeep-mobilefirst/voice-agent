export default class AudioRecorder {
    constructor() {
      this.mediaRecorder = null;
      this.audioChunks = [];
    }
  
    async startRecording() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.mediaRecorder = new MediaRecorder(stream);
  
      this.mediaRecorder.ondataavailable = event => {
        this.audioChunks.push(event.data);
      };
  
      this.mediaRecorder.onstop = () => {
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        audio.play();
        
        // Return the audio blob when recording stops
        this.audioBlob = audioBlob;
      };
  
      this.mediaRecorder.start();
    }
  
    stopRecording() {
      this.mediaRecorder.stop();
    }
  
    sendAudio() {
      const formData = new FormData();
      formData.append('audio', this.audioBlob, 'recorded-audio.wav');
  
      return fetch('/upload-audio', {
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
    }
  }
  