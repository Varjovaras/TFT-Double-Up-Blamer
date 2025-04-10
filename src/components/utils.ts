/**
 * Utility functions for the Rito TFT application
 */
import type{ AccountV1Response, Player } from './types';

/**
 * Formats a player's name with their tag line
 * @param name Player's game name
 * @param tagLine Player's tag line
 * @returns Formatted string like "name#tagLine"
 */
export const formatPlayerName = (name: string, tagLine: string): string => {
  return `${name}#${tagLine}`;
};

/**
 * Fetches a player's PUUID from Riot API
 * @param name Player's game name
 * @param tagLine Player's tag line
 * @returns Promise with player's PUUID
 */
export const fetchPlayerPUUID = async (name: string, tagLine: string): Promise<string> => {
  try {
    const response = await fetch(
      `/api/tft/matches?name=${encodeURIComponent(name)}&tagLine=${encodeURIComponent(tagLine)}`
    );
    
    if (!response.ok) {
      throw new Error(`Failed to fetch PUUID: ${response.status}`);
    }
    
    const data = await response.json();
    return data.puuId;
  } catch (error) {
    console.error('Error fetching PUUID:', error);
    throw error;
  }
};

/**
 * Converts an AccountV1Response to a Player object
 * @param account Account data from Riot API
 * @returns Player object
 */
export const accountToPlayer = (account: AccountV1Response): Player => {
  return {
    puuid: account.puuid,
    name: account.gameName,
    tagLine: account.tagLine
  };
};