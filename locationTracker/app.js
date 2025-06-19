var myMap = L.map("map").setView([22.9074872, 79.07306671], 13);

const tileUrl = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const attribution =
  '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetmap</a>contributors,coded by build web developer';

const tiles = L.tileLayer(tileUrl, { attribution });
tiles.addTo(myMap);

function generateList() {
  const ul = document.querySelector(".list");

  storeList.forEach((site) => {
    const li = document.createElement("li");
    const div = document.createElement("div");
    const a = document.createElement("a");
    const p = document.createElement("p");

    a.addEventListener("click", () => {
      flyToSite(site);
    });

    div.classList.add("site-item");

    a.innerText = site.properties.name;
    a.href = "#";
    p.innerText = site.properties.address;

    div.appendChild(a);
    div.appendChild(p);
    li.appendChild(div);
    ul.appendChild(li);
  });
}

generateList();

function makePopupContent(site) {
  return `
  <div>
  <h4>${site.properties.name}</h4>
  <p>${site.properties.address}</p>

  <div class="phoneno">
  <a href="tel:${site.properties.phone}">${site.properties.phone}</a>
  </div>
  </div>`;
}

function onEachFeature(feature, layer) {
  layer.bindPopup(makePopupContent(feature), {
    closeButton: false,
    offset: L.point(0, -8),
  });
}

const myIcon = L.icon({
  iconUrl: "constructionIcon.png",
  iconSize: [40, 30],
  className: "blinking",
});
const siteLayer = L.geoJSON(storeList, {
  onEachFeature: onEachFeature,
  pointToLayer: function (feature, latlng) {
    return L.marker(latlng, { icon: myIcon });
  },
});

siteLayer.addTo(myMap);

function flyToSite(site) {
  const lat = site.geometry.coordinates[1];
  const lng = site.geometry.coordinates[0];
  myMap.flyTo([lat, lng], 14, {
    // animate: false
    duration: 3,
  });

  setTimeout(() => {
    L.popup({ closeButton: false, offset: L.point(0, -8) })
      .setLatLng([lat, lng])
      .setContent(makePopupContent(site))
      .openOn(myMap);
  }, 3000);
}
