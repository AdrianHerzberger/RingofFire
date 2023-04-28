import { DialogRef } from '@angular/cdk/dialog';
import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent implements OnInit {

  renderProfilePictures = ['player_1.png', 'player_2.png', 'player_3.png', 'player_4.png', 'player_5.png', 'player_6.png', 'player_7.png'];

  constructor(public dialogRef: MatDialogRef<EditPlayerComponent>) {
    
  }

  ngOnInit(): void {
    
  }

}
