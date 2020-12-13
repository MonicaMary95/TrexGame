var PLAY=1;
var END=0;
var gameState = PLAY;

var mario,marioImage,bkg,bkgImage,cloudImage,groundImage,invisibleground,ground;
var obstacle,cloud,obstacle1,obstacle2,obstacle3,obstacle4;

var score;

function preload() {
  
  marioImage = loadAnimation("marioo.png", "mario1.png", "mario2.png", "mario3.png");
  mario_collided=loadAnimation("edit-removebg-preview.png");
  mariojump=loadAnimation("jumpmario.png");
  bkgImage = loadImage("backg.png");
  cloudImage = loadImage("Lakitu_Cloud.png");
  groundImage = loadImage("ground.png");
  obstacle1=loadImage("trap1.png");
  obstacle2=loadImage("trap2.png");
  obstacle3=loadImage("trap3.png");
  obstacle4=loadImage("mush2.png");
  CoinImage=loadImage("coin.png");
  gameoverImage=loadImage("game_over_PNG58.png");
  restartImage=loadImage("retry-removebg-preview.png")
  
   jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  
  
}


function setup() {
  createCanvas(500, 400);
  
 
  
  bkg = createSprite(180, 180, 500, 400);
  bkg.addImage("background", bkgImage);
  bkg.velocityX = -2;
  bkg.scale = 1.5;

  
  
  mario = createSprite(100, 250, 20, 20);
  mario.addAnimation("Mario", marioImage);
  mario.addAnimation("Collide",mario_collided);
  mario.addAnimation("fly",mariojump);
  mario.scale = 0.3;

  obstaclesGroup= new Group();
  cloudsGroup=new Group();
  coinsGroup=new Group();
  
  invisibleground = createSprite(200, 330, 600, 20)
  invisibleground.visible = false;

  ground = createSprite(200, 374, 500, 20);
  ground.addImage("Grnd", groundImage);
  
  ground.scale = 1.2;

  gameover=createSprite(260,170,5,5);
  gameover.addImage("gameovr",gameoverImage);
  gameover.scale=0.1;
  
  restart=createSprite(265,210,5,5);
  restart.addImage("restrt",restartImage);
  restart.scale=0.15;
  
  

  score=0;
  
  mario.setCollider("circle",50,0,40)
  mario.debug=false;
}

function draw() 
{
  background("navyblue");
  
  
  if(gameState === PLAY)
{
    gameover.visible=false;
    restart.visible=false;
  
  if(score>0 && score % 500 === 0){
       checkPointSound.play() 
    }
    
    ground.velocityX = -6;
    //score = score + Math.round(getFrameRate()/60)
    
    if (bkg.x < 0) {
    bkg.x = bkg.width / 2;
    }
    if (ground.x < 0) {
    ground.x = ground.width / 2;
    }
    
    if(keyDown("space")&& mario.y>=200){
    mario.velocityY=-10;
    jumpSound.play();
      
    }
  
   
    mario.velocityY=mario.velocityY+0.8;
    
    spawnCloud();
    spawnObstacles();
    spawnCoins();
    
    if(obstaclesGroup.isTouching(mario)){
      gameState= END;
      dieSound.play()
    }
  if(coinsGroup.isTouching(mario)){
    coinsGroup.destroyEach(0);
    score=score+2;
    
  }
}
  
  else if(gameState === END)
{
    gameover.visible=true;
    restart.visible=true;
    
    ground.velocityX = 0;
    bkg.velocityX=0;
    mario.velocityY=0;
    mario.changeAnimation("Collide",mario_collided);
    
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
    coinsGroup.setLifetimeEach(-1);
    obstaclesGroup.setVelocityXEach(0);
    cloudsGroup.setVelocityXEach(0);
    coinsGroup.setVelocityXEach(0);
  
    if(mousePressedOver(restart)){
    reset();
  }
    
}
  
  
  mario.collide(invisibleground);
  
  
  drawSprites();
  
  fill("black");
  text("Score : "+score,400,50);
  
  
}

function spawnCloud() 
{
  
  if (frameCount % 90 === 0) 
  {
    cloud = createSprite(490, 90, 50, 20);
    cloud.addImage("clouds", cloudImage);
    cloud.y = Math.round(random(15, 150));
    cloud.scale = 0.1;
    cloud.velocityX = -4;
    cloud.lifetime=245;
    cloud.depth=mario.depth;
    mario.depth=mario.depth+1;
    cloudsGroup.add(cloud);
  }
}

function spawnObstacles()
{
  if (frameCount % 120 === 0) 
  {
    obstacle = createSprite(450,313, 20, 65);
    obstacle.velocityX=-5;
    obstacle.scale=0.3
    var rand=Math.round(random(1,4));
    //obstacle.scale=0.1
    
    switch(rand)
    {
      case 1:obstacle.addImage(obstacle1)
        break;
      case 2:obstacle.addImage(obstacle2)
        break;
      case 3:obstacle.addImage(obstacle3)
        break;
      case 4:obstacle.addImage(obstacle4)
        break;
        default:break;
    }
    obstacle.lifetime=160;
    obstacle.depth=mario.depth;
    obstacle.depth=ground.depth;
    
    obstaclesGroup.add(obstacle);
    ground.depth=ground.depth+1;
  }
}
function spawnCoins(){
  if(frameCount%150===0){
    coins=createSprite(400,200,10,10);
    coins.addImage("coin",CoinImage);
    coins.scale=0.1;
    coins.velocityX=-5;
    coins.lifetime=250;
    coinsGroup.add(coins);
    coins.depth=mario.depth;
    mario.depth=mario.depth+1;
  }
}
function reset(){
  gameState = PLAY;
  gameover.visible=false;
  restart.visible=false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  coinsGroup.destroyEach();
  mario.changeAnimation("Mario",marioImage);
  score=0;
}