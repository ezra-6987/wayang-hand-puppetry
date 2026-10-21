
export const storyScenes = [
  {
    id: 1,
    title: "Si Labu Labi",
    puppets: [
      {
        id: "A",
        name: "Si Labu",
        image: `${import.meta.env.BASE_URL}assets/wayang-a.png`,
        hand: "Left",
        x: 0.3,
        y: 0.5,
      },
      {
        id: "B",
        name: "Si Labi",
        image: `${import.meta.env.BASE_URL}assets/wayang-b.png`,
        hand: "Right",
        x: 0.7,
        y: 0.5,
      },
    ],
  },
  {
    id: 2,
    title: "Pak Saloi",
    puppets: [
      {
        id: "C",
        name: "Rusa",
        image: `${import.meta.env.BASE_URL}assets/wayang-c.png`,
        hand: "Left",
        x: 0.3,
        y: 0.5,
      },
      {
        id: "D",
        name: "Pak Saloi",
        image: `${import.meta.env.BASE_URL}assets/wayang-d.png`,
        hand: "Right",
        x: 0.7,
        y: 0.5,
      },
    ],
  },
];
