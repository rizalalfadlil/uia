export const sfx = (key: string) => {
  const available = ["u", "i", "a"];
  if (available.includes(key.toLowerCase())) {
    const audio = new Audio(`/uia/cat-assets/sounds/${key}.mp3`);
    audio.play();
  }
};
export const img = (index: number) => { 
  const max = 3;
  return `/uia/cat-assets/images/${(index % max) + 1}.png`; 
};

