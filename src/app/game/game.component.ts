import { Component, OnInit } from '@angular/core'
import {
  MeGQL,
  NewMoveGQL,
  PerformMoveGQL,
  Player,
  PlayerType,
} from 'src/generated/graphql'

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
  board = [
    ['', '', ''],
    ['', '', ''],
    ['', '', ''],
  ]

  currentTurn: PlayerType
  me: Pick<Player, 'playerType'>
  isItMyTurn = false

  constructor(
    private newMoveGQL: NewMoveGQL,
    private performMoveGQL: PerformMoveGQL,
    private meGQL: MeGQL,
  ) {}

  subscribeToNewMoves() {
    this.newMoveGQL.subscribe().subscribe(
      ({
        data: {
          newMove: {
            i,
            j,
            player: { playerType },
            game: {
              currentTurn: { playerType: currentTurn },
            },
          },
        },
      }) => {
        this.subscribeToNewMoves()
        this.onMove(i, j, playerType)
        this.currentTurn = currentTurn
        this.isItMyTurn = currentTurn === this.me.playerType
      },
    )
  }

  ngOnInit() {
    this.meGQL.watch().valueChanges.subscribe((r) => {
      this.me = r.data.me
      this.isItMyTurn = this.me.playerType === PlayerType.X
    })
    this.subscribeToNewMoves()
  }

  onMove(i: number, j: number, playerType: PlayerType) {
    this.board[i][j] = playerType
  }

  onClick(i: number, j: number) {
    this.performMoveGQL.mutate({ i, j }).subscribe()
  }
}
