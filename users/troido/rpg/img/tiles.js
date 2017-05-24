(function(name,data){
 if(typeof onTileSetLoaded === 'undefined') {
  if(typeof TileSets === 'undefined') TileSets = {};
  TileSets[name] = data;
 } else {
  onTileMapLoaded(name,data);
 }})("standart_tiles",
{
    "columns":8,
    "firstgid":1,
    "image":"img\/standart_tiles.png",
    "imageheight":256,
    "imagewidth":256,
    "margin":0,
    "name":"standart_tiles",
    "spacing":0,
    "tilecount":64,
    "tileheight":32,
    "tilewidth":32
});