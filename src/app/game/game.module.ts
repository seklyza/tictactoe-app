import { CommonModule } from '@angular/common'
import { NgModule } from '@angular/core'
import { IonicModule } from '@ionic/angular'
import { GameRoutingModule } from './game-routing.module'
import { GameComponent } from './game.component'

@NgModule({
  declarations: [GameComponent],
  imports: [CommonModule, GameRoutingModule, IonicModule],
})
export class GameModule {}
