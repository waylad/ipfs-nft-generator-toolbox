const {
  readFileSync,
  writeFileSync,
  readdirSync,
  rmSync,
  existsSync,
  mkdirSync,
} = require("fs");
const { create } = require("ipfs-http-client");
require("dotenv").config();

const projectId = process.env.INFURA_API_ID;
const projectSecret = process.env.INFURA_API_SECRET;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");
const client = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

// const client = create({ url: 'https://ipfs.infura.io:5001/api/v0' })

const template = `
    <svg width="230" height="230" viewBox="0 0 230 230" fill="none" xmlns="http://www.w3.org/2000/svg">
        <!-- weapon -->
        <!-- wing -->
        <!-- engine -->
        <!-- cabin -->
    </svg>
`;

function getLayer(name, skip = 0.0) {
  const svg = readFileSync(`./layers/${name}.svg`, "utf-8");
  const re = /(?<=\<svg\s*[^>]*>)([\s\S]*?)(?=\<\/svg\>)/g;
  const layer = svg.match(re)[0];
  return Math.random() > skip ? layer : "";
}

async function createImage(weapon, wing, engine, cabin) {
  // Step 1: Generate images
  console.log(
    `Image ${weapon}${wing}${engine}${cabin} : Generating image file`
  );
  const image = template
    .replace("<!-- weapon -->", getLayer(`weapon${weapon}`))
    .replace("<!-- wing -->", getLayer(`wing${wing}`))
    .replace("<!-- engine -->", getLayer(`engine${engine}`))
    .replace("<!-- cabin -->", getLayer(`cabin${cabin}`));

  const shipCode = `${cabin}${engine}${wing}${weapon}`;
  writeFileSync(`./out/${shipCode}.svg`, image);

  // Step 2: Upload images to IPFS
  console.log(
    `Image ${weapon}${wing}${engine}${cabin} : Uploading image to IPFS`
  );
  const uploadImage = await client.add(image);
  console.log(
    `Image ${weapon}${wing}${engine}${cabin} : Uploaded to ipfs://${uploadImage.path}`
  );

  // Step 3: Generate Metadata
  console.log(
    `Image ${weapon}${wing}${engine}${cabin} : Generating metadata json file`
  );
  const meta = {
    name: `Spaceship ${shipCode}`,
    description: "A Spaceship NFT",
    image: `ipfs://${uploadImage.path}`,
    attributes: [
      {
        cabin,
        rarity: 0.25,
      },
      {
        engine,
        rarity: 0.25,
      },
      {
        wing,
        rarity: 0.25,
      },
      {
        weapon,
        rarity: 0.25,
      },
    ],
  };

  // Step 4: Upload Metadata - NOT WORKING YET FOR SOME REASON
  // const uploadMetadata = await client.add(JSON.stringify(meta));
  // console.log(`Metadata ${shipCode} uploaded to ipfs://${uploadMetadata.path}`);
  console.log(
    `Image ${weapon}${wing}${engine}${cabin} : Writing metadata json and image file in /out`
  );
  writeFileSync(
    `./out/${cabin}${engine}${wing}${weapon}.json`,
    JSON.stringify(meta)
  );

  console.log(
    `Image ${weapon}${wing}${engine}${cabin} : DONE ---------------------------`
  );
}

// Create dir if not exists
if (!existsSync("./out")) {
  mkdirSync("./out");
}

// Cleanup dir before each run
readdirSync("./out").forEach((f) => rmSync(`./out/${f}`));

async function main() {
  for (let weapon = 0; weapon <= 3; weapon++) {
    for (let wing = 0; wing <= 3; wing++) {
      for (let engine = 0; engine <= 3; engine++) {
        for (let cabin = 0; cabin <= 3; cabin++) {
          await createImage(weapon, wing, engine, cabin);
        }
      }
    }
  }
}

main();
