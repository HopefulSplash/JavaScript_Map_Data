let youtubeData;
let countries;
let painted;

let myMap;
let canvas;
let data = [];
const mappa = new Mappa("Leaflet");

function preload() {
  youtubeData = loadTable("subscribers_geo.csv", "header");
  countries = loadJSON("countries.json");
}

const options = {
  lat: 35,
  lng: 0,
  zoom: 2,
  style: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
};

function setup() {
  painted = false;
  canvas = createCanvas(windowWidth / 1.3, windowHeight / 1.3).parent(
    "canvasContainer"
  );
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);

  let maxSubs = 0;
  let minSubs = Infinity;

  for (let row of youtubeData.rows) {
    let country = row.get("country_id").toLowerCase();
    let latlon = countries[country];
    if (latlon) {
      let lat = latlon[0];
      let lon = latlon[1];
      let count = Number(row.get("subscribers"));
      let r = getColorCode();
      let b = getColorCode();
      let g = getColorCode();
      data.push({
        lat,
        lon,
        count,
        r,
        b,
        g,
      });

      if (count > maxSubs) {
        maxSubs = count;
      }
      if (count < minSubs) {
        minSubs = count;
      }
    }
  }

  let minD = sqrt(minSubs);
  let maxD = sqrt(maxSubs);

  for (let country of data) {
    country.diameter = map(sqrt(country.count), minD, maxD, 1, 20);
  }
}

function getColorCode() {
  let num = Math.random() * (255 - 10) + 10;

  return Math.round(num);
}
let alpha = 0;
let up = true;

function draw() {
  clear();
  
  if (up == true) {
    alpha = alpha + 1;
  } else {
    if (alpha <= 0) {
      up = true;
      frameCount = 0;
    } else {
      alpha = alpha - 1;
    }
  }

  if (frameCount >= 300) {
    up = false;
  }
  for (let country of data) {
    const pix = myMap.latLngToPixel(country.lat, country.lon);

    fill(country.r, country.b, country.g, alpha);

    stroke(0, 0, 0, 0);
    const zoom = myMap.zoom();
    const scl = pow(2, zoom);
    ellipse(pix.x, pix.y, country.diameter * scl);
  }
}

//<button type="button">Nuclear Power Plants</button>
//<button type="button">Nuclear Waste</button>
//<button type="button">Nuclear Raditation</button>
//<button type="button">Nuclear Test</button>
//<button type="button">Nuclear Tests</button>
