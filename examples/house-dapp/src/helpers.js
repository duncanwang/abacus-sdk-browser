export const BURL = "https://backend.abacusprotocol.com";
export const APPID = "a6ed3cfa-d5ac-4b5a-b500-230bb25558f4";
export const HOUSECONTRACT = "189ad47F19407Fbeb01f50CecEFebE69701D5c2E";
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

export const randomName = () => {
  return NAMES[Math.floor(Math.random() * (NAMES.length - 1))];
};

export const generateHouses = abacus => {
  [...Array(30)].map((x, i) =>
    abacus.setTokenAnnotations({
      address: HOUSECONTRACT,
      tokenId: i + 1,
      data: {
        ethereum: {
          commitments: {
            tid: (i + 1).toString(),
            photo:
              HOUSE_IMAGES[
                Math.floor(Math.random() * (HOUSE_IMAGES.length - 1))
              ],
            location: Math.round(Math.random()) ? "Japan" : "United States",
            bed: Math.floor(Math.random() * 3).toString(),
            bath: Math.floor(Math.random() * 3).toString()
          }
        },
        private: {
          name: randomName(),
          price: Math.floor(Math.random() * 500 * 1000).toString()
        }
      }
    })
  );
};
