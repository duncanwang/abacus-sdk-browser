export const BURL = "https://backend.abacusprotocol.com";
export const APPID = "9d924e82-b2da-4e24-a1ed-885a5c30a17d";
export const HOUSECONTRACT = "1b007d83a19c1628c427e616bb8dc5dd8f8e479c";
export const HOUSE_IMAGES = [
  "https://photos.zillowstatic.com/p_f/IS6uic30zqgwrw0000000000.jpg",
  "https://photos.zillowstatic.com/p_f/IS62h4qdicipus0000000000.jpg",
  "https://photos.zillowstatic.com/p_f/ISahj3k1s0w1ow0000000000.jpg",
  "https://photos.zillowstatic.com/p_f/IS62h4qdicipus0000000000.jpg",
  "https://photos.zillowstatic.com/p_f/ISuwo1ltg6hgj70000000000.jpg",
  "https://photos.zillowstatic.com/p_f/ISmamulfany6a60000000000.jpg"
];
export const NAMES = [
  "Mario Speedwagon",
  "Petey Cruiser",
  "Anna Sthesia",
  "Paul Molive",
  "Anna Mull",
  "Gail Forcewind",
  "Paige Turner",
  "Bob Frapples"
];

export const getAllHouses = async abacus => {
  return await Promise.all(
    [...Array(30)].map(async (x, i) => {
      return abacus.getTokenAnnotations({
        address: HOUSECONTRACT,
        tokenId: i + 1
      });
    })
  );
};

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
