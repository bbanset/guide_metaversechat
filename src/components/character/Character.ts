import { Room } from "colyseus.js";




export class CharacterComponent {
  private room: Room;
  private playerEntities: { [sessionId: string]: any } = {};

  constructor(room: Room) {
    this.room = room;
  }

  initialize(scene: Phaser.Scene) {
    this.room.state.players.onAdd((player, sessionId) => {
      console.log("A player has joined! Their unique session id is", sessionId);
      const entity = scene.physics.add.image(player.x, player.y, "ship_0001");
      this.playerEntities[sessionId] = entity;
      player.onChange(() => {
        entity.x = player.x;
        entity.y = player.y;
      });
    });

    this.room.state.players.onRemove((player, sessionId) => {
      const entity = this.playerEntities[sessionId];
      if (entity) {
        entity.destroy();
        delete this.playerEntities[sessionId];
      }
    });
  }
}
