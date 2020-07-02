import { Injectable } from '@angular/core'
import * as Apollo from 'apollo-angular'
import gql from 'graphql-tag'
export type Maybe<T> = T | null
export type Exact<T extends { [key: string]: any }> = { [K in keyof T]: T[K] }
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
}

/** The main game type. */
export type Game = {
  __typename?: 'Game'
  id: Scalars['ID']
  /** The 6-digit game code. */
  code: Scalars['String']
  /** Whether the game has started or not. */
  started: Scalars['Boolean']
  currentTurn: Player
  players: Array<Player>
  moves: Array<Move>
}

/** Result for joining or creating a game. Contains an authentication token and the game. */
export type JoinGameResult = {
  __typename?: 'JoinGameResult'
  /** A token used to authenticate using the Authorization header. */
  token: Scalars['String']
  /** The game joined/created. */
  game: Game
}

/** Represents a move in the game. */
export type Move = {
  __typename?: 'Move'
  id: Scalars['ID']
  player: Player
  /** The cell which the player has performed the move on. */
  index: Scalars['Int']
  game: Game
}

export type Mutation = {
  __typename?: 'Mutation'
  /** Creates a new game. */
  createGame: JoinGameResult
  /** Joins a game using a 6-digit game code. */
  joinGame?: Maybe<JoinGameResult>
  /** Performs a move for the current game. */
  performMove: Move
}

export type MutationJoinGameArgs = {
  code: Scalars['String']
}

export type MutationPerformMoveArgs = {
  index: Scalars['Int']
}

/** Represents a player in the game. */
export type Player = {
  __typename?: 'Player'
  id: Scalars['ID']
  moves: Array<Move>
  game: Game
  playerType: PlayerType
}

/** A player can either be the X or the O. */
export enum PlayerType {
  X = 'X',
  O = 'O',
}

export type Query = {
  __typename?: 'Query'
  /** Returns the current authenticated player. */
  me?: Maybe<Player>
}

export type Subscription = {
  __typename?: 'Subscription'
  /** Notifies when the game starts. */
  gameStarts: Game
  /** Notifies when a new move is performed. */
  newMove: Move
  /** Notifies when the game ends. The return type is the winner. */
  gameEnds: Player
}

export type CreateGameMutationVariables = Exact<{ [key: string]: never }>

export type CreateGameMutation = { __typename?: 'Mutation' } & {
  createGame: { __typename?: 'JoinGameResult' } & Pick<
    JoinGameResult,
    'token'
  > & { game: { __typename?: 'Game' } & Pick<Game, 'code'> }
}

export type JoinGameMutationVariables = Exact<{
  code: Scalars['String']
}>

export type JoinGameMutation = { __typename?: 'Mutation' } & {
  joinGame?: Maybe<
    { __typename?: 'JoinGameResult' } & Pick<JoinGameResult, 'token'> & {
        game: { __typename?: 'Game' } & Pick<Game, 'code'>
      }
  >
}

export const CreateGameDocument = gql`
  mutation createGame {
    createGame {
      token
      game {
        code
      }
    }
  }
`

@Injectable({
  providedIn: 'root',
})
export class CreateGameGQL extends Apollo.Mutation<
  CreateGameMutation,
  CreateGameMutationVariables
> {
  document = CreateGameDocument
}
export const JoinGameDocument = gql`
  mutation joinGame($code: String!) {
    joinGame(code: $code) {
      token
      game {
        code
      }
    }
  }
`

@Injectable({
  providedIn: 'root',
})
export class JoinGameGQL extends Apollo.Mutation<
  JoinGameMutation,
  JoinGameMutationVariables
> {
  document = JoinGameDocument
}
