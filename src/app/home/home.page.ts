import { Component } from '@angular/core'
import { AlertController } from '@ionic/angular'
import { ApolloError } from 'apollo-client'
import { map } from 'rxjs/operators'
import { CreateGameGQL, JoinGameGQL } from 'src/generated/graphql'

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  gameCode: string = ''

  constructor(
    private alertController: AlertController,
    private createGameGQL: CreateGameGQL,
    private joinGameGQL: JoinGameGQL,
  ) {}

  resetGameCode() {
    this.gameCode = ''
    localStorage.removeItem('token')
  }

  async createGame() {
    const { token, game } = await this.createGameGQL
      .mutate()
      .pipe(map((r) => r.data.createGame))
      .toPromise()

    this.gameCode = game.code
    localStorage.setItem('token', token)
  }

  async joinGame(code: string) {
    try {
      const {
        data: {
          joinGame: { token },
        },
        errors,
      } = await this.joinGameGQL.mutate({ code }).toPromise()

      localStorage.setItem('token', token)
    } catch (e) {
      if (e instanceof ApolloError) {
        if (e.graphQLErrors.length > 0) {
          const { message } = e.graphQLErrors[0]

          const errorAlert = await this.alertController.create({
            header: 'Error',
            message,
            buttons: ['Ok'],
          })

          await errorAlert.present()
        }
      }
    }
  }

  async presentExistingGameAlert() {
    const alert = await this.alertController.create({
      header: 'Join an existing game',
      inputs: [
        {
          placeholder: 'Game code',
          type: 'number',
        },
      ],
      buttons: [
        'Cancel',
        {
          text: 'Join Game',
          handler: (data) => {
            const code: string = data[0]

            if (!code || !code.trim()) {
              return false
            }

            this.joinGame(code)
          },
        },
      ],
    })

    await alert.present()
  }
}
