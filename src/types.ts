export type Card = {
    Id: string
    Name: string
    Mana: number
    Damage: number
    Health: number
}

export type MapOfCards = {
    [uuid: string]: Card
}

