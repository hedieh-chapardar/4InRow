import { ColorEnum } from "../enums/color-enum";
import { Player } from "../game-components";

export function getBgColorClassNameBasedOnColorEnum(color: ColorEnum): string {
    return `bg-${color}`;
}

export function getActivePlayerIndex(players: Player[]): number {
    return players.findIndex(player => player.isActive)
}

export function getActivePlayer(players: Player[]): Player {
    const activePlayers = players.filter((player: Player) => player.isActive);
    
    const hasError = validateActivePlayers(activePlayers);
    if (hasError)
        throw new Error(hasError);

    return activePlayers[0];
}

function validateActivePlayers(activePlayers: Player[]): string | null {
    if (activePlayers.length === 0)
        return 'Always one player is required to play the game.';

    if (activePlayers.length > 1)
        return `Only 1 player can be active at the moment.`;

    return null;
}