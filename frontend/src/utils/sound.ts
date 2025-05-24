// Create audio elements for like and unlike sounds
const likeSound = new Audio('/sounds/like.mp3');
const unlikeSound = new Audio('/sounds/unlike.mp3');

// Set volume to 50%
likeSound.volume = 0.5;
unlikeSound.volume = 0.5;

export const playLikeSound = () => {
  // Reset the audio to start
  likeSound.currentTime = 0;
  // Play the sound
  likeSound.play().catch(error => {
    console.log('Error playing like sound:', error);
  });
};

export const playUnlikeSound = () => {
  // Reset the audio to start
  unlikeSound.currentTime = 0;
  // Play the sound
  unlikeSound.play().catch(error => {
    console.log('Error playing unlike sound:', error);
  });
}; 