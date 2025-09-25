document.addEventListener('DOMContentLoaded', function() {
  // Вибираємо елементи
  const video = document.querySelector('.video-element');
  const playButton = document.querySelector('.play-button');
  const stopButton = document.querySelector('.stop-button');

  // Подія на кнопку
  playButton.addEventListener('click', () => {
    stopButton.style.opacity = '1';
    playButton.style.display = 'none';
    video.play();
  });

  stopButton.addEventListener('click', () => {
    video.pause();
    playButton.style.display = 'block';
    stopButton.style.opacity = '0';
  });

  video.addEventListener('ended', () => {
    playButton.style.display = 'block';
    stopButton.style.opacity = '0';
  });
});
