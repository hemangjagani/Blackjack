var blackjack ={
    'you':{'scoreSpan':'#yourScore','div':'#your-box','score': 0},
    'dealer':{'scoreSpan':'#dealerScore','div':'#dealer-box','score': 0},
    'cards':['2','3','4','5','6','7','8','9','10','J','Q','K','A'],
    'cardMap':{'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'Q':10,'K':10,'A':[1,11]},
    'wins':0,
    'losses': 0,
    'drew':0,
    'isStand': false,
    'trunOver': false,
}
const YOU = blackjack['you'];
const DEALER = blackjack['dealer'];
const hitSound = new Audio('blackjack_assets/sounds/swish.m4a');
const winSound = new Audio('blackjack_assets/sounds/cash.mp3');
const lossSound = new Audio('blackjack_assets/sounds/aww.mp3');

document.querySelector('#Hit').addEventListener('click',blackJackHit);
document.querySelector('#Stand').addEventListener('click',blackJackStand);
document.querySelector('#Deal').addEventListener('click',deal);
function blackJackHit()
{
  if(blackjack['isStand']===false)
  {
  var cards = randomCard();
   console.log(cards);
  showCard(cards,YOU);
  updateScore(cards,YOU);
  showScore(YOU);
  console.log(YOU['score']);
  blackjack['turnOver']=false;
  }
}
function updateScore(cards,activePlayer)
{
  if(cards == 'A')
  {
    if(activePlayer['score'] + blackjack['cardMap'][cards][1] <= 21)
    {
      activePlayer['score'] += blackjack['cardMap'][cards][1];
    }
    else{
      activePlayer['score'] += blackjack['cardMap'][cards][0];
    }
  }
  else{
    activePlayer['score'] += blackjack['cardMap'][cards];
  }
  
}
function showScore(activePlayer)
{
  if(activePlayer['score']> 21)
  {
    document.querySelector(activePlayer['scoreSpan']).textContent = 'Busted!!';
    document.querySelector(activePlayer['scoreSpan']).style.color = 'red';
  }
  else
  {
 document.querySelector(activePlayer['scoreSpan']).textContent = activePlayer['score'];
  }
}
function randomCard()
{
 let randomIndex = Math.floor(Math.random()*13);
 return blackjack['cards'][randomIndex];
}
function showCard(cards,activePlayer)
{
    if(activePlayer['score']<=21)
    {
    var cardImage = document.createElement('img');
    cardImage.src = 'blackjack_assets/images/' + cards + '.png';
    document.querySelector(activePlayer['div']).appendChild(cardImage);
    hitSound.play();
    }
}
function deal()
{
  if(blackjack['turnOver']==true)
  {
    blackjack['isStand']=false;
    computeWinner();
  
    var yourImages = document.querySelector('#your-box').querySelectorAll('img');
    var dealerImages = document.querySelector('#dealer-box').querySelectorAll('img');
    document.querySelector('#result').textContent = 'Play Now';
    document.querySelector('#result').style.color = 'black';

   for(let i=0 ;i< yourImages.length;i++)
   {
     yourImages[i].remove();     
   }

   for(let i=0 ;i< dealerImages.length;i++)
   {
     dealerImages[i].remove();    
   }
   YOU ['score'] = 0;
   DEALER['score'] = 0;
   document.querySelector('#yourScore').textContent = 0;
   document.querySelector('#dealerScore').textContent = 0;
   document.querySelector('#yourScore').style.color ='white';
   document.querySelector('#dealerScore').style.color ='white';
  blackjack['turnOver']=true;
   
  }
   
}

function sleep(ms)
{
  return new Promise( resolve => setTimeout(resolve,ms));
}
async function blackJackStand()
{
  
  blackjack['isStand']= true;
  while(DEALER['score'] < 16 && blackjack['isStand']==true)
  {
  var cards = randomCard();
  showCard(cards,DEALER);
  updateScore(cards,DEALER);
  showScore(DEALER);
  await sleep(1000);
  }
  
    blackjack['turnOver']=true;
    let winner = computeWinner();
    showMessage(winner);
  
}
function computeWinner()
{
  
  let winner;
  if(YOU['score']<=21)
  {
    if(YOU['score'] > DEALER ['score'] || (DEALER['score'] >21))
    {
      winner=YOU;
      blackjack['wins']++;
    }
    else if(YOU['score'] < DEALER['score'])
    {
      winner=DEALER;
      blackjack['losses']++;
    }
    else if(YOU['score'] === DEALER['score'])
    {
      blackjack['drew']++;
    }
  }
  else if(YOU['score'] > 21 && DEALER['score']<=21)
  {
    winner= DEALER;
    blackjack['losses']++;
  }
  else if(YOU['score'] > 21 && DEALER['score'] >21)
  {
    blackjack['drew']++;
  }
  return winner;
}
function showMessage(winner)
{
  let message,messageColor;
  if(blackjack['turnOver']===true)
    {  
     if(winner == YOU)
    {
      document.querySelector('#wins').textContent = blackjack['wins'];
     message = 'I think we won';
    messageColor = 'green';
    winSound.play();
   }
  else if (winner == DEALER)
    {
    document.querySelector('#losses').textContent = blackjack['losses'];
    message = 'We Lost..We Lost..';
    messageColor = 'red';
    lossSound.play();
    }
  else
    {
    document.querySelector('#draws').textContent = blackjack['drew'];
    message = 'We Drew';
    messageColor = 'black';
    lossSound.play();
     }
  document.querySelector('#result').textContent = message;
  document.querySelector('#result').style.color = messageColor;
}
  
}
