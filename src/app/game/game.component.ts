import { Component, OnInit } from '@angular/core'
import { AlertController } from '@ionic/angular'
import {
  GameEndsGQL,
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
    private alertController: AlertController,
    private newMoveGQL: NewMoveGQL,
    private performMoveGQL: PerformMoveGQL,
    private meGQL: MeGQL,
    private gameEndsGQL: GameEndsGQL,
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

    this.gameEndsGQL.subscribe().subscribe(
      async ({
        data: {
          gameEnds: {
            moves: { length: moves },
            playerType,
          },
        },
      }) => {
        const header =
          playerType === this.me.playerType ? 'You won!' : 'You lost!'

        const alert = await this.alertController.create({
          header,
          message: `Player ${playerType} won with ${moves} moves!`,
          backdropDismiss: false,
          buttons: [
            {
              text: 'OK',
              handler() {
                window.location.replace('/')
              },
            },
          ],
        })

        await alert.present()
      },
    )
  }

  onMove(i: number, j: number, playerType: PlayerType) {
    this.board[i][j] = playerType
  }

  onClick(i: number, j: number) {
    this.performMoveGQL.mutate({ i, j }).subscribe()
  }
}
