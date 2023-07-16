import Phaser from "phaser";
import { Client, Room } from "colyseus.js";
import Adam from "../public/Adam_idle_anim_24.png";
import { CharacterComponent } from "./components/character/Character";
import { ChatComponent } from "./components/chat/Chat";
import { KeyboardComponent } from "./components/keyboard/Keyboard";

export class GameScene extends Phaser.Scene {
  private client = new Client("ws://localhost:2567");
  private room: Room;
  private chatComponent: ChatComponent;
  private characterComponent: CharacterComponent;
  private keyboardComponent: KeyboardComponent;

  constructor() {
    super("game-scene");
  }

  preload() {
    this.load.image("ship_0001", Adam);
  }

  async create() {
    try {
      this.room = await this.client.joinOrCreate("my_room");
      console.log("Joined successfully!");

      this.chatComponent = new ChatComponent(this.room);
      this.characterComponent = new CharacterComponent(this.room);
      this.keyboardComponent = new KeyboardComponent(this.room, this.input.keyboard.createCursorKeys());

      this.chatComponent.initialize(this);
      this.characterComponent.initialize(this);
    } catch (e) {
      console.error(e);
    }
  }

  update(time: number, delta: number): void {
    if (this.keyboardComponent) {
      this.keyboardComponent.update();
    }
  }
}