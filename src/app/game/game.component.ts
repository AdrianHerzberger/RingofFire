import { Component, OnInit } from '@angular/core';
import { Game } from 'src/models/game';
import { MatDialog } from '@angular/material/dialog';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { ActivatedRoute } from '@angular/router';
import { Firestore, doc, getDoc, collection, updateDoc } from '@angular/fire/firestore';
import { EditPlayerComponent } from '../edit-player/edit-player.component';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})

export class GameComponent implements OnInit {
  game: Game;
  gameId: string;
  gameOver: boolean = false;

  constructor (
    private route: ActivatedRoute,
    public dialog: MatDialog,
    private firestore: Firestore,
  ) {}

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      this.gameId = params['id'];
      const gameRef = doc(this.firestore, 'games', this.gameId); // create a reference to the Game document with the specified ID
      getDoc(gameRef).then((gameDoc) => { // use getDoc to retrieve the document snapshot
        if (gameDoc.exists()) {
          const gameData = gameDoc.data();
          this.game.currentPlayer = gameData['currentPlayer'];
          this.game.playerImages = gameData['playerImages'], 
          this.game.playedCards = gameData['playedCards'];
          this.game.players = gameData['players'];
          this.game.stack = gameData['stack'];
          this.game.pickCardAnimation = gameData['pickCardAnimation'];
          this.game.currentCard = gameData['currentCard'];
        } 
      })
    });
  }

  newGame(): void {
    this.game = new Game();
  }

  takeCard(): void {
    if (this.game.stack.length == 0) {
      this.gameOver = true;
    } else if (!this.game.pickCardAnimation) {
      const poppedCard = this.game.stack.pop();
      if (poppedCard !== undefined) {
        this.game.currentCard = poppedCard;
        this.game.pickCardAnimation = true;
        console.log("New card:" + this.game.currentCard);
        console.log("Game is:", this.game);
        this.game.currentPlayer++;
        this.game.currentPlayer = this.game.currentPlayer % this.game.players.length;
        this.saveGame();
        
        setTimeout(() => {
          this.game.playedCards.push(this.game.currentCard);
          this.game.pickCardAnimation = false;
          this.saveGame();
        }, 1000);
      }
    }
  }

  editPlayer(playerId: number) {
    console.log('edit-player', playerId);
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((stateChanges: string) => {
        console.log('Recived change' , stateChanges);
        if (stateChanges) {
          if (stateChanges == 'DELETE') {
            this.game.players.splice(playerId, 1);
            this.game.playerImages.splice(playerId, 1);     
          } else {
            this.game.playerImages[playerId] = stateChanges;
          }
          this.saveGame();
        }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.playerImages.push('player_1.png');
      }
    });
  }

  saveGame() {
    const updateameRef = collection(this.firestore, 'games');
    const getUpdateRef = doc(updateameRef, this.gameId);
    updateDoc(getUpdateRef, this.game.toJson());
  }
}

