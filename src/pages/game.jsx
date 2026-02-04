import React, { useState, useRef, useEffect }from "react";
import Phaser from "phaser";
import GameComponent from "/src/components/gameComponet.jsx";

const Home = () => {
  const [message, setMessage] = useState(null); // ✅ React state to control the popup
  const messageRef = useRef();
  useEffect(() => {
      messageRef.current = setMessage; // Store setMessage in ref
  }, [])

class Example extends Phaser.Scene {
    constructor(){
        super("scene-game")
        this.platforms = null
        this.cursors = null
        this.player = null
        this.pickles = null
        this.score = 0
        this.scoretext = null
        this.goal = null
        this.bombs = null
        this.enemy = null
    }
    

    
   preload() {
    //this.load.image('izaiah', ) //Add iziah to the game
    this.load.image('pickle', '/assets/pickle.png')
    this.load.image('bg', '/assets/citybackground.jpg')
    this.load.image('ground','/assets/platform.png')
    this.load.image('jameer', '/assets/jameerhead.png')
    this.load.image('wedge','/assets/wedgehead.png')
  }

  create() {

    this.bombs = this.physics.add.group()

    this.add.image(0,0,'bg').setOrigin(0,0)
    this.goal = this.physics.add.staticImage(800, 175, "wedge").setScale(0.08);

    this.player = this.physics.add.image(100,450,'jameer').setScale(.03)
    this.player.setBounce(0.2)
    this.player.setCollideWorldBounds(true)
    
    this.platforms = this.physics.add.staticGroup(); // ✅ Use `this.platforms`

    this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();

    this.platforms.create(600, 400, 'ground');
    this.platforms.create(50, 250, 'ground');
    this.platforms.create(750, 220, 'ground');


    this.cursors = this.input.keyboard.createCursorKeys();
    this.physics.add.collider(this.player, this.platforms);


    this.pickles = this.physics.add.group({
      key: 'pickle',
      repeat: 11,
      setScale: (.012),
      setXY: { x: 12, y: 0, stepX: 60 }
  });
  this.pickles.children.iterate(function (child) {
    child.setScale(0.25);
    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

  });

  this.goal.body.setCircle((this.goal.width * 0.03) / 2);
  this.goal.body.setSize(this.goal.width * 0.08, this.goal.height * 0.08);
  this.goal.body.setOffset(
    (this.goal.width - this.goal.body.width) / 2,
    (this.goal.height - this.goal.body.height) / 2
  );


  this.physics.add.collider(this.pickles, this.platforms);
  this.physics.add.overlap(this.player, this.pickles, this.collectPickle, null, this);
  this.physics.add.overlap(this.player, this.goal, this.checkFinish, null, this);



  this.scoreText = this.add.text(16, 16, 'pickles: 0', { fontSize: '32px', fill: '#000' });



  }
  update(){
    if (this.cursors.left.isDown)
      {
          this.player.setVelocityX(-160);

      }
      else if (this.cursors.right.isDown)
      {
          this.player.setVelocityX(160);

      }
      else
      {
          this.player.setVelocityX(0);

      }

      if (this.cursors.up.isDown && this.player.body.touching.down)
      {
          this.player.setVelocityY(-250);
      }
  }
  collectPickle(player, pickle) {
    pickle.disableBody(true, true);

    this.score += 10; // ✅ Use `this.score`
    this.scoreText.setText("Pickles: " + this.score); // ✅ Use `this.scoreText`
  }
  checkFinish(player, goal) {
    const showMessage = messageRef.current;
    if (showMessage) {
      if (this.score >= 120) {
        messageRef.current("Yay Pickles! Go to: https://youtu.be/FMWKa-U3hTg for the rest of the surprise!! ");
      } else {
       messageRef.current("No!! Come back when you get my pickles >:D ");
      }
    }
  }
}


  const config = {
    type: Phaser.AUTO,
    parent: 'phaser-container',
    width: 850,
    height: 600,
    scene: Example,
    physics: {
      default: "arcade",
      arcade: {
        gravity: { y: 200 },

      },
    },
  };

  return (
    <div className="home-container">
      <h1 className="gameTitle">Happy Valentines day!!!!</h1>
      <h2 className="gameTitle">Collect the pickles and bring them to you</h2>
      <h3 className="gameTitle">Because you love pickles lol</h3>
      <div className="gameCenter">
        <GameComponent config={config} />
      </div>

      {message && (
        <div className="popup">
          <p>{message}</p>
          <button onClick={() => setMessage(null)}>Close</button>
        </div>
      )}
    </div>
  );
};

export default Home;