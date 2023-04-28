import { Component } from '@angular/core';
import { Firestore, collection, doc, setDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from 'src/models/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {

  constructor(
    private router: Router,
    private firestore: Firestore,
  ) {}

  newGame() {
    let game = new Game();
    const gamesCollection = collection(this.firestore, 'games');
    const startGameData = doc(gamesCollection);

    setDoc(startGameData, game.toJson())
      .then(() => {
        console.log('Game added successfully!');
        // retrieve the document ID from the document reference
        const gameId = startGameData.id;
        console.log('Game ID:', gameId);
        this.router.navigateByUrl('/game/' + gameId);
      })
  }
}

