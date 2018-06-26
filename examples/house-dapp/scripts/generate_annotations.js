export const randomImage = () => HOUSE_IMAGES[
  Math.floor(Math.random() * (HOUSE_IMAGES.length - 1))
];

export const randomName = () => NAMES[Math.floor(Math.random() * (NAMES.length - 1))]; 

export const generateHouses = abacus => {
  [...Array(30)].map((x, i) =>
    abacus.setTokenAnnotations({
      address: HOUSECONTRACT,
      tokenId: i + 1,
      data: {
        ethereum: {
          commitments: {
            tid: (i + 1).toString(),
            photo: randomImage(),
            location: Math.round(Math.random()) ? "Japan" : "United States",
            bed: Math.floor(Math.random() * 3 + 1).toString(),
            bath: Math.floor(Math.random() * 3 + 1).toString()
          }
        },
        private: {
          name: randomName(),
          description: "One of the finest houses of the house collection",
          image: randomImage(),
          external_url: randomImage(),
          background_color: "#d0d",
          price: Math.floor(Math.random() * 500 * 1000).toString()
        }
      }
    })
  );
};