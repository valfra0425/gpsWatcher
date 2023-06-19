// opções do geolocalization
const options = {
    enableHighAccuracy: true,
    // tempo máximo que a aplicação aceita para uma posição no cache
    maximumAge: 10000,
    // tempo no qual uma posição expira
    timeout: 5000,
};

// iniciação do mapa
var map = L.map('map').setView([51.505, -0.09], 19);

// camada de vizualização do mapa do google maps
googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 22,
    subdomains:['mt0','mt1','mt2','mt3']
}).addTo(map);

/* outras camadas de mapa
- esse é um página com uma lista de tiles do OPenStreetMaps
https://wiki.openstreetmap.org/wiki/Raster_tile_providers
- aqui tem camadas do googlemaps
https://gis.stackexchange.com/questions/225098/using-google-maps-static-tiles-with-leaflet
*/

// esse é a função da api geolocation que pega a posição do dispositivo e assiste a mudança
var watcherId = navigator.geolocation.watchPosition(success, error, options);

//iniciação das variáveis 
let marker, circle, zoomed;

// função chamada quando o watchPosition funciona
function success(position) {
    // variáveis adquiridas pelo watchPosition
    var lat = position.coords.latitude;
    var lon = position.coords.longitude;
    var acc = position.coords.accuracy;

    // verificação se o marcador já existe no mapa
    if (marker){
        //caso ele exista, removemos eles, para assim adicionar na posição atualizada
        map.removeLayer(marker);
        map.removeLayer(circle);
    }

    // marcador da posição do dispositivo
    marker = L.marker([lat, lon])
        .addTo(map)
        .bindPopup("aqui está você!!!");

    // circulo com raio igual a precisão da localização
    circle = L.circle([lat, lon], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.2,
        radius: acc
    }).addTo(map);

    //essa verificação ocorre para impedir que fitbounds altere o zoom atual do mapa
    if(!zoomed){
        // o fitBounds é usado para setar a vizualização e o zoom do mapa em um elemento criado (no caso abaixo o circle)
        zoomed = map.fitBounds(circle.getBounds());
    }

    //seta a visualização do mapa centrada no usuário
    map.setView(marker.getLatLng());
}

// função chamada quando o watchPosition não funciona
function error(err) {
    if(err === 1){
        alert("por favor, permita acessar sua localização")
    } else {
        alert("não foi possível achar sua localização")
    }
}