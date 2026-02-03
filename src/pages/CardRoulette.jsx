import React, { useEffect, useState } from 'react';
import * as signalR from '@microsoft/signalr';

const CardGame = () => {
    const [connection, setConnection] = useState(null);
    const [myPlayerId, setMyPlayerId] = useState(null);
    const [gameState, setGameState] = useState({
        currentPlayer: 0,
        countdown: 10,
        isClockwise: true,
        totalPlayers: 0,
        lastCardPlayed: null
    });
    const [myHand, setMyHand] = useState([]);
    const [errorMessage, setErrorMessage] = useState(null);
    const [playerUpdates, setPlayerUpdates] = useState([]);
    const [stealingCard, setStealingCard] = useState(false);
    const [cardDescriptions] = useState({
        'Skip': 'Skip the next player\'s turn.',
        'Reverse': 'Reverse the order of play.',
        'Haste': 'Reduce the countdown timer by 2.',
        'Diffuse': 'Increases the countdown timer by 1',
        'Panic': 'Do nothing as you watch in fear.',
        'Steal': 'Steal a random card from a targeted player.'
    });

    useEffect(() => {
        // 1. Establish the connection to your C# Server
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl("http://localhost:5055/GameHub", {
                // Skip the talk and go straight to the pipe (Immedietly uses websockets, Will not fallback to other transport methods, can be fixed later)
                skipNegotiation: true,
                transport: signalR.HttpTransportType.WebSockets
            })
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(() => {
                    console.log('Connected!');
                    
                    // Listen for player assignment from server
                    connection.on("ReceivePlayerAssignment", (playerId) => {
                        console.log('Assigned as Player', playerId);
                        setMyPlayerId(playerId);
                    });
                    
                    // Listen for game state updates (convert C# PascalCase to camelCase)
                    connection.on("UpdateGameState", (state) => {
                        console.log('Game state updated:', state);
                        setGameState(state);
                    });

                    // Listen for hand updates
                    connection.on("ReceiveHand", (hand) => {
                        console.log('Received hand:', hand);
                        setMyHand(hand);
                    });

                    // Listen for errors from server
                    connection.on("ReceiveError", (error) => {
                        console.error('Server error:', error);
                        setErrorMessage(error);
                        setTimeout(() => setErrorMessage(null), 3000);
                    });

                    // Listen for other player actions
                    connection.on("PlayerActionUpdate", (message) => {
                        console.log('Player action:', message);
                        setPlayerUpdates(prev => [...prev, message].slice(-5));
                    });

                    // Listen for game start
                    connection.on("GameStarted", (firstPlayer) => {
                        console.log('Game started! First player:', firstPlayer);
                    });

                    // Automatically request to join game
                    connection.invoke("JoinGame")
                        .catch(err => console.error('Failed to join game:', err));
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const playCard = (card, targetPlayerId = null) => {
        if (connection && myPlayerId) {
            // Convert card name to lowercase for server
            const cardNameLower = card.toLowerCase();
            
            // If it's a steal card, we need a target
            if (cardNameLower === 'steal') {
                if (!targetPlayerId) {
                    setStealingCard(true);
                    return;
                }
                setStealingCard(false);
            }
            
            connection.invoke("PlayCard", myPlayerId, cardNameLower)
                .then(() => {
                    console.log(`Played ${card}`);
                    // Request updated hand from server since PlayCard doesn't send it back
                    connection.invoke("GetMyHand", myPlayerId)
                        .catch(err => console.error('Failed to get updated hand:', err));
                })
                .catch(err => console.error('Failed to play card:', err));
        }
    };

    const selectStealTarget = (targetId) => {
        if (connection && myPlayerId && stealingCard) {
            // Note: Server currently doesn't fully support targeting, but we'll prepare for it
            playCard('Steal', targetId);
        }
    };

    const startGame = () => {
        if (connection) {
            connection.invoke("StartGame")
                .catch(err => console.error('Failed to start game:', err));
        }
    };

    // Show waiting screen until player is assigned
    if (!myPlayerId) {
        return (
            <div className="lobby">
                <h2>Joining Game...</h2>
                <p>Waiting for player assignment...</p>
            </div>
        );
    }

    // Show game board once assigned
    return (
        <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
            <h2>You are Player {myPlayerId}</h2>
            
            {errorMessage && (
                <div style={{ color: 'red', fontWeight: 'bold', padding: '10px', background: '#ffe6e6', marginBottom: '10px' }}>
                    {errorMessage}
                </div>
            )}
            
            {/* LOBBY VIEW */}
            {gameState.currentPlayer === 0 ? (
                <div className="lobby-screen">
                    <h3>Waiting for Players... ({gameState.totalPlayers}/4)</h3>
                    {myPlayerId === 1 ? (
                        <button 
                            onClick={startGame} 
                            disabled={gameState.totalPlayers < 2}
                            style={{ padding: '10px 20px', fontSize: '1.2rem' }}
                        >
                            Start Game
                        </button>
                    ) : (
                        <p>Waiting for Player 1 to start the game...</p>
                    )}
                </div>
            ) : (
                /* GAME VIEW */
                <div className="game-screen">
                    <div style={{ background: '#f0f0f0', padding: '15px', borderRadius: '8px' }}>
                        <h1>Countdown: {gameState.countdown}</h1>
                        <h2 style={{ color: gameState.currentPlayer === myPlayerId ? 'green' : 'black' }}>
                            {gameState.currentPlayer === myPlayerId ? "IT IS YOUR TURN!" : `Waiting for Player ${gameState.currentPlayer}...`}
                        </h2>
                        <p>Direction: {gameState.isClockwise ? 'Clockwise ↻' : 'Counter-Clockwise ↺'}</p>
                    </div>

                    <div className="hand" style={{ marginTop: '20px' }}>
                        <h3>Your Cards: ({myHand.length})</h3>
                        {stealingCard && (
                            <div style={{ background: '#fff3cd', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}>
                                <p><strong>Select a player to steal from:</strong></p>
                                {Array.from({length: gameState.totalPlayers}, (_, i) => i + 1)
                                    .filter(id => id !== myPlayerId)
                                    .map(playerId => (
                                        <button 
                                            key={playerId}
                                            onClick={() => selectStealTarget(playerId)}
                                            style={{ margin: '5px', padding: '8px 15px' }}
                                        >
                                            Player {playerId}
                                        </button>
                                    ))}
                                <button 
                                    onClick={() => setStealingCard(false)}
                                    style={{ margin: '5px', padding: '8px 15px', background: '#dc3545', color: 'white' }}
                                >
                                    Cancel
                                </button>
                            </div>
                        )}
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                            {myHand.map((card, index) => (
                                <div key={index} style={{ textAlign: 'center' }}>
                                    <button 
                                        onClick={() => playCard(card)}
                                        disabled={gameState.currentPlayer !== myPlayerId || stealingCard}
                                        style={{ 
                                            margin: '5px', 
                                            padding: '15px 20px',
                                            fontSize: '1.1rem',
                                            fontWeight: 'bold',
                                            cursor: gameState.currentPlayer === myPlayerId && !stealingCard ? 'pointer' : 'not-allowed'
                                        }}
                                        title={cardDescriptions[card] || ''}
                                    >
                                        {card}
                                    </button>
                                    {cardDescriptions[card] && (
                                        <p style={{ fontSize: '0.75rem', color: '#666', maxWidth: '150px', margin: '5px auto' }}>
                                            {cardDescriptions[card]}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>
                        <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '10px' }}>
                            💡 Cards are automatically replaced when played!
                        </p>
                    </div>
                </div>
            )}
            
            {/* LOG SECTION */}
            <div style={{ marginTop: '30px', borderTop: '1px solid #ccc' }}>
                <h4>Game Log:</h4>
                {playerUpdates.map((msg, i) => <p key={i} style={{ fontSize: '0.8rem' }}>{msg}</p>)}
            </div>
        </div>
    );
};

export default CardGame;