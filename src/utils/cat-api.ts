export const sfx = (key: string) => {
  const available = ["u", "i", "a"];
  if (available.includes(key.toLowerCase())) {
    const audio = new Audio(`/cat-assets/sounds/${key}.mp3`);
    audio.play();
  }
};
export const img = (index: number) => { 
  const max = 3;
  return `/cat-assets/images/${(index % max) + 1}.png`; 
};

