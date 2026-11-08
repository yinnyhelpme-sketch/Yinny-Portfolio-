import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

type RobloxGame = {
  id: number;
  rootPlaceId?: number;
  name: string;
  creator?: { name?: string };
  playing?: number;
  visits?: number;
  favoritedCount?: number;
  maxPlayers?: number;
};

async function getGameDetails(universeIds: number[]) {
  if (!universeIds.length) return [];
  const batches: number[][] = [];
  for (let i = 0; i < universeIds.length; i += 50) batches.push(universeIds.slice(i, i + 50));
  const responses = await Promise.all(batches.map(async batch => {
    const response = await fetch(`https://games.roblox.com/v1/games?universeIds=${batch.join(',')}`, { cache: 'no-store' });
    if (!response.ok) throw new Error('Roblox game statistics are temporarily unavailable.');
    const payload = await response.json();
    return (payload.data ?? []) as RobloxGame[];
  }));
  return responses.flat();
}

function formatGame(game: RobloxGame) {
  return {
    id: String(game.id),
    placeId: String(game.rootPlaceId ?? game.id),
    name: game.name,
    creator: game.creator?.name ?? 'Unknown creator',
    playing: game.playing ?? 0,
    visits: game.visits ?? 0,
    favorites: game.favoritedCount ?? 0,
    maxPlayers: game.maxPlayers ?? null,
    url: `https://www.roblox.com/games/${game.rootPlaceId ?? game.id}`,
    updatedAt: new Date().toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const groupId = request.nextUrl.searchParams.get('groupId');
  if (groupId) {
    if (!/^\d+$/.test(groupId)) return NextResponse.json({ error: 'The group ID must be numeric.' }, { status: 400 });
    try {
      const groupGames: RobloxGame[] = [];
      let cursor = '';
      do {
        const query = new URLSearchParams({ accessFilter: 'Public', limit: '100', sortOrder: 'Asc' });
        if (cursor) query.set('cursor', cursor);
        const response = await fetch(`https://games.roblox.com/v2/groups/${groupId}/games?${query.toString()}`, { cache: 'no-store' });
        if (!response.ok) throw new Error('Could not retrieve the public experiences for this Roblox group.');
        const payload = await response.json();
        groupGames.push(...((payload.data ?? []) as RobloxGame[]));
        cursor = payload.nextPageCursor ?? '';
      } while (cursor);
      const details = await getGameDetails(groupGames.map(game => game.id));
      return NextResponse.json({ games: details.map(formatGame), groupId, count: details.length, updatedAt: new Date().toISOString() });
    } catch (error) {
      return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to load this group.' }, { status: 502 });
    }
  }

  const raw = request.nextUrl.searchParams.get('url');
  if (!raw) return NextResponse.json({ error: 'Add a Roblox game URL or group ID.' }, { status: 400 });
  let parsed: URL;
  try { parsed = new URL(raw); } catch { return NextResponse.json({ error: 'That is not a valid URL.' }, { status: 400 }); }
  if (!['roblox.com', 'www.roblox.com'].includes(parsed.hostname)) return NextResponse.json({ error: 'Only Roblox game links are supported.' }, { status: 400 });
  const match = parsed.pathname.match(/\/games\/(\d+)/);
  if (!match) return NextResponse.json({ error: 'For individual games, use the full Roblox game page URL (roblox.com/games/PLACE_ID). Share links may need to be opened and copied as a regular game URL first.' }, { status: 400 });
  try {
    const placeId = match[1];
    const universeResponse = await fetch(`https://apis.roblox.com/universes/v1/places/${placeId}/universe`, { cache: 'no-store' });
    if (!universeResponse.ok) throw new Error('Roblox could not resolve that game link.');
    const { universeId } = await universeResponse.json();
    const details = await getGameDetails([universeId]);
    const game = details[0];
    if (!game) throw new Error('No public statistics were returned for this game.');
    return NextResponse.json(formatGame({ ...game, rootPlaceId: Number(placeId) }));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to retrieve statistics.' }, { status: 502 });
  }
}
