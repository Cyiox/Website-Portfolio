using Microsoft.AspNetCore.SignalR;
using System;
using System.Collections.Generic;
using System.Linq;

public class GameHub : Hub
{

    // Add this to your fields at the top of GameHub.cs
private static Dictionary<string, int> _connectionToPlayer = new();
    private static int _countdown = 10;
    private static List<int> _activePlayers = new(); // Start empty
    private static int _currentPlayerTurn = 0;        // 0 means game hasn't started
    private static bool _isClockwise = true;

    // Random number generator
    private static Random _rng = new();

    private static Dictionary<int, List<string>> _playerHands = new();

    // Available card names
    private static List<string> _cardNames = new() { "Skip", "Reverse", "Haste", "Diffuse", "Panic", "Steal" };

    private static Dictionary<string, string> _cardDescriptions = new()
    {
        ["Skip"] = "Skip the next player's turn.",
        ["Reverse"] = "Reverse the order of play.",
        ["Haste"] = "Reduce the countdown timer by 2.",
        ["Diffuse"] = "Increases the countdown timer by 1",
        ["Panic"] = "Do nothing as you watch in fear.",
        ["Steal"] = "Steal a random card from a targeted player."
    };

   // Card Effects (synchronous, safer implementations)

   private void ApplySkip(int playersSkipped)
    {
        int step = _isClockwise ? playersSkipped + 1 : -(playersSkipped + 1);
        int currentIndex = _activePlayers.IndexOf(_currentPlayerTurn);
        int nextIndex = (currentIndex + step + _activePlayers.Count) % _activePlayers.Count;
        _currentPlayerTurn = _activePlayers[nextIndex];
    }

    private void ApplyReverse()
    {
        _isClockwise = !_isClockwise;
    }

    private void ApplyDiffuse(int extraTurns)
    {
        _countdown += extraTurns;
    }

    private void ApplyHaste(int reduceTurns)
    {
        _countdown -= reduceTurns;
    }

    private void ApplyPanic()
    {
        // No effect
    }

    private void ApplySteal(int thiefId, int targetId = -1)
    {
        // If no target provided, pick a random valid target with at least one card
        if (targetId <= 0)
        {
            var possibleTargets = _activePlayers.Where(id => id != thiefId && _playerHands.ContainsKey(id) && _playerHands[id].Count > 0).ToList();
            if (possibleTargets.Count == 0) return;
            targetId = possibleTargets[_rng.Next(possibleTargets.Count)];
        }

        if (_playerHands.ContainsKey(targetId) && _playerHands[targetId].Count > 0)
        {
            int randomIndex = _rng.Next(_playerHands[targetId].Count);
            string stolenCard = _playerHands[targetId][randomIndex];

            // Remove from target and add to thief
            _playerHands[targetId].RemoveAt(randomIndex);
            if (!_playerHands.ContainsKey(thiefId)) _playerHands[thiefId] = new List<string>();
            _playerHands[thiefId].Add(stolenCard);
        }
    }
    // This method is what your React app calls
    public async Task PlayCard(int playerId, string cardName)
    {
        // Validate player is in game and has a hand
        if (!_activePlayers.Contains(playerId) || !_playerHands.ContainsKey(playerId))
        {
            await Clients.Caller.SendAsync("ReceiveError", "You are not in the game.");
            return;
        }

        // Ensure it's the player's turn
        if (playerId != _currentPlayerTurn)
        {
            await Clients.Caller.SendAsync("ReceiveError", "It is not your turn!");
            return;
        }

        // Ensure the player actually has the card (case-insensitive match)
        var hand = _playerHands[playerId];
        var cardInHand = hand.FirstOrDefault(c => string.Equals(c, cardName, StringComparison.OrdinalIgnoreCase));
        if (cardInHand == null)
        {
            await Clients.Caller.SendAsync("ReceiveError", "You don't have that card.");
            return;
        }

        // 2. Execute Logic (Your switch statement)
        var cardKey = cardInHand.ToLowerInvariant();
        switch (cardKey)
        {
            case "skip":
                ApplySkip(1);
                break;
            case "reverse":
                ApplyReverse();
                break;
            case "haste":
                ApplyHaste(1);
                break;
            case "diffuse":
                ApplyDiffuse(1);
                break;
            case "panic":
                ApplyPanic();
                break;
            case "steal":
                ApplySteal(playerId);
                break;
            default:
                await Clients.Caller.SendAsync("ReceiveError", $"Unknown card: {cardName}");
                return;
        }

        // Remove played card from players hand 
        hand.Remove(cardInHand);

        // Add a new random card to the player's hand
        string newCard = _cardNames[_rng.Next(_cardNames.Count)];
        hand.Add(newCard);

        // 3. Standard move to next player
        MoveToNextPlayer();

        // 4. Tick down the clock
        if (_countdown > 0) _countdown--;

        // 5. Broadcast the new state to EVERYONE connected
        await Clients.All.SendAsync("UpdateGameState", new {
            CurrentPlayer = _currentPlayerTurn,
            Countdown = _countdown,
            IsClockwise = _isClockwise,
            LastCardPlayed = cardName
        });
    }

    // Your helper logic moves here too!
    private void MoveToNextPlayer()
    {
        int currentIndex = _activePlayers.IndexOf(_currentPlayerTurn);
        int step = _isClockwise ? 1 : -1;
        int nextIndex = (currentIndex + step + _activePlayers.Count) % _activePlayers.Count;
        _currentPlayerTurn = _activePlayers[nextIndex];
    }

    // 1. Draw Card: Updates the server state, then tells only the caller their new hand
    public async Task DrawCard(int playerId)
    {
     // Ensure player exists
     if (!_playerHands.ContainsKey(playerId))
     {
         await Clients.Caller.SendAsync("ReceiveError", "You are not in the game.");
         return;
     }

     // Logic to pick a random card
     string newCard = _cardNames[_rng.Next(_cardNames.Count)];
     _playerHands[playerId].Add(newCard);

       // SECURITY: We only send the new hand to the person who drew it
     await Clients.Caller.SendAsync("ReceiveHand", _playerHands[playerId]);
    
     // PUBLIC: We tell everyone ELSE that Player X drew a card (but not what it is!)
     await Clients.Others.SendAsync("PlayerActionUpdate", $"Player {playerId} drew a card.");
    }

    // 2. GetMyHand: Used when a player refreshes their browser
    public async Task GetMyHand(int playerId)
    {   
     // SECURITY: Only send the specific hand to the specific requester
     if (!_playerHands.ContainsKey(playerId))
     {
         await Clients.Caller.SendAsync("ReceiveError", "You are not in the game.");
         return;
     }
     await Clients.Caller.SendAsync("ReceiveHand", _playerHands[playerId]);
    }
   public async Task JoinGame()
{
    if (_activePlayers.Count >= 4) {
        await Clients.Caller.SendAsync("ReceiveError", "Game is full!");
        return;
    }

    // Assign ID
    int newPlayerId = 1;
    while (_activePlayers.Contains(newPlayerId)) newPlayerId++;
    
    _activePlayers.Add(newPlayerId);
    _activePlayers.Sort(); // Keep the list ordered 1, 2, 3...
    _connectionToPlayer[Context.ConnectionId] = newPlayerId;
    _playerHands[newPlayerId] = new List<string>();

    await Clients.Caller.SendAsync("ReceivePlayerAssignment", newPlayerId);
    
    // Crucial: Tell everyone the lobby has changed
    await UpdateAllClients();
}

public async Task StartGame()
{
    // Only allow the first player in the list to start
    if (_activePlayers.Count > 0 && _activePlayers[0] == _connectionToPlayer[Context.ConnectionId])
    {
        if (_activePlayers.Count < 2) {
            await Clients.Caller.SendAsync("ReceiveError", "Need at least 2 players!");
            return;
        }

        _currentPlayerTurn = _activePlayers[0];
        _countdown = 10; // Reset for start

        // Deal initial hands
        foreach (var id in _activePlayers) {
            _playerHands[id] = new List<string>();
            for (int j = 0; j < 5; j++) {
                _playerHands[id].Add(_cardNames[_rng.Next(_cardNames.Count)]);
            }
            // Send the specific hand to the specific connection for that player
            var connectionId = _connectionToPlayer.FirstOrDefault(x => x.Value == id).Key;
            if (connectionId != null) {
                await Clients.Client(connectionId).SendAsync("ReceiveHand", _playerHands[id]);
            }
        }

        await UpdateAllClients();
        await Clients.All.SendAsync("PlayerActionUpdate", "The game has started!");
    }
}
    // Helper to keep everyone in sync
    private async Task UpdateAllClients()
    {
     await Clients.All.SendAsync("UpdateGameState", new {
         CurrentPlayer = _currentPlayerTurn,
         Countdown = _countdown,
         IsClockwise = _isClockwise,
         TotalPlayers = _activePlayers.Count
     });
    }
    
public override async Task OnDisconnectedAsync(Exception? exception)
{
    if (_connectionToPlayer.TryGetValue(Context.ConnectionId, out int playerId))
    {
        _activePlayers.Remove(playerId);
        _playerHands.Remove(playerId);
        _connectionToPlayer.Remove(Context.ConnectionId);

        // If no players left, reset game state
        if (_activePlayers.Count == 0)
        {
            _countdown = 10;
            _currentPlayerTurn = 0;
        }

        await UpdateAllClients();
        Console.WriteLine($"---> Player {playerId} left. Remaining: {_activePlayers.Count}");
    }
    await base.OnDisconnectedAsync(exception);
}
}