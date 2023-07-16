import { Room } from "colyseus.js";

export class ChatComponent {
  private room: Room;
  private chatMessages: string[] = [];
  private chatInput: string = "";
  private text: Phaser.GameObjects.Text;
  private chatMode: boolean;

  constructor(room: Room) {
    this.room = room;
  }

  initialize(scene: Phaser.Scene) {
    this.text = scene.add.text(0, 600 - 200, "", {
      color: "black",
      wordWrap: { width: 300 },
    });

    this.room.onMessage("chat", (message) => {
      this.chatMessages.push(`${message.id}: ${message.message}`);
      this.updateChatText();
      console.log(`${message.id}: ${message.message}`);
    });
    this.chatMode = false;
      scene.input.keyboard.on("keydown", (event: KeyboardEvent) => {
        if (event.key === "Enter") {
          if (this.chatMode) {
            this.room.send("chat", this.chatInput);
            this.chatInput = "";
          }
          this.chatMode = !this.chatMode;
        }
        else if (this.chatMode && /^[a-zA-Z0-9 ]+$/.test(event.key)) {
          this.chatInput += event.key;
        }
        else if (this.chatMode && event.key === "Backspace") {
          this.chatInput = this.chatInput.slice(0, -1);
          event.preventDefault();
        }
        this.updateChatText();
      });
  }

  updateChatText() {
    this.text.setText([...this.chatMessages.slice(-10), "> " + this.chatInput].join("\n"));
  }
}
