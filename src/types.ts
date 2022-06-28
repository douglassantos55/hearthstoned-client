export type Card = {
    Id: string
    Name: string
    Mana: number
    Damage: number
    Health: number
    State: string
}

export type MapOfCards = {
    [uuid: string]: Card
}

