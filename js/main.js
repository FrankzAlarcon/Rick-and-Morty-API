document.addEventListener('DOMContentLoaded', ()=>{
  initApp();
});

async function initApp(){
  /**Get the characters and insert in DOM */
  const API = 'https://rickandmortyapi.com/api/character'; 
  const characters = await getData(API);
  const containerCards = document.querySelector('.container-cards');
  insertCards(characters, containerCards);
  
  /**Searcher  */
  const searcher = document.querySelector('#searcher');
  searcher.addEventListener('input',(event)=>{
    const charactersFilter = characters.filter((character)=>character.name.toLowerCase().includes(event.target.value.toLowerCase()));    
    containerCards.replaceChildren()
    insertCards(charactersFilter, containerCards)
  });

  /**Show more characters */
  let page = 2;
  let API_EXTENSION = `https://rickandmortyapi.com/api/character?page=${page}`;
  let moreCharacters;
  const buttonShowMore = document.querySelector('.button-show-more');
  buttonShowMore.addEventListener('click',async ()=>{
    moreCharacters = await getData(API_EXTENSION);
    insertCards(moreCharacters,containerCards);
    characters.push(...moreCharacters);
    page++;
    API_EXTENSION = `https://rickandmortyapi.com/api/character?page=${page}`;
    if(searcher.value){
      const charactersFilter = characters.filter((character)=>character.name.toLowerCase().includes(searcher.value.toLowerCase()));
      containerCards.replaceChildren()
      insertCards(charactersFilter, containerCards)
    }
    if(page > 34){
      buttonShowMore.remove();
    }
  });

}
function getData(API){
  const charactersData = fetch(API)
                          .then(result => result.json())
                          .then(data => data.results)
                          .then(charactersData=>{
                            return charactersData.map((character)=>{
                              return {
                                id: character.id,
                                name: character.name,
                                status: character.status,
                                species: character.species,
                                gender: character.gender,
                                image: character.image,
                              }
                            });
                          })
                          .catch((error)=>console.log(error));
  return charactersData;
}
function insertCards(characters = [], container){
  for (let index in characters) {
    /**Create HTML elements */
    const card = document.createElement('DIV');
    card.classList.add('card')
    const imageCard = document.createElement('IMG');
    const textContainer = document.createElement('DIV');
    textContainer.classList.add('card__text-container')
    const textName = document.createElement('P');
    const textStatus = document.createElement('P');
    const textSpecie = document.createElement('P');
    const textGender = document.createElement('P');
    /**Add attributes and text to the HTML elements */
    imageCard.src = characters[index].image;
    textName.innerHTML = `<span class="attributes">Nombre: </span>${characters[index].name}`;
    textStatus.innerHTML = `<span class="attributes">Estado: </span>${characters[index].status}`;
    textSpecie.innerHTML = `<span class="attributes">Especie: </span>${characters[index].species}`;
    textGender.innerHTML = `<span class="attributes">Género: </span>${characters[index].gender}`;

    /**Add the elements to the container */
    card.appendChild(imageCard);
    textContainer.appendChild(textName);
    textContainer.appendChild(textStatus);
    textContainer.appendChild(textSpecie);
    textContainer.appendChild(textGender);
    card.appendChild(textContainer);
    container.appendChild(card);
  }
}