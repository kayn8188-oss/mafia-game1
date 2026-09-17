'use client';

import React, { useState } from 'react';
import { Shield, Eye, Users, Play, BookOpen, UserPlus, X, HelpCircle } from 'lucide-react';

const ROLES = [
  { id: 'mafia', name: 'المافيا', team: 'عصابة الحارة', desc: 'يصوتون ليلاً للقضاء على أحد المواطنين.', icon: '🔪' },
  { id: 'inspector', name: 'المفتش', team: 'الأهالي', desc: 'يكشف هوية لاعب واحد كل ليلة.', icon: '🔍' },
  { id: 'doctor', name: 'الطبيب', team: 'الأهالي', desc: 'يحمي لاعباً واحداً كل ليلة من القتل.', icon: '💉' },
  { id: 'civilian', name: 'مواطن', team: 'الأهالي', desc: 'يحاول معرفة المافيا بالتصويت في النهار.', icon: '👤' },
];

export default function V0MafiaApp() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [players, setPlayers] = useState([]);
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [showRole, setShowRole] = useState(false);

  const handleCreateRoom = () => {
    if (!playerName.trim()) return alert('الرجاء إدخال اسمك أولاً');
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setRoomCode(code);
    setPlayers([{ id: '1', name: playerName, isHost: true }]);
    setCurrentScreen('lobby');
  };

  const handleJoinRoom = () => {
    if (!playerName.trim() || !roomCode.trim()) return alert('يرجى كتابة الاسم ورمز الغرفة');
    setPlayers(prev => [...prev, { id: Date.now().toString(), name: playerName, isHost: false }]);
    setShowJoinModal(false);
    setCurrentScreen('lobby');
  };

  const addMockPlayer = () => {
    const mockNames = ['أحمد', 'حسين', 'زينب', 'مريم', 'مصطفى', 'علي', 'فاطمة'];
    const randomName = mockNames[Math.floor(Math.random() * mockNames.length)] + ' ' + (players.length + 1);
    setPlayers(prev => [...prev, { id: Date.now().toString(), name: randomName, isHost: false }]);
  };

  const handleStartGame = () => {
    if (players.length < 3) return alert('الحد الأدنى للبدء هو 3 لاعبين');
    const pool = ['mafia', 'inspector', 'doctor'];
    while (pool.length < players.length) pool.push('civilian');
    const shuffled = [...pool].sort(() => Math.random() - 0.5);

    setPlayers(players.map((p, idx) => ({
      ...p,
      role: ROLES.find(r => r.id === shuffled[idx])
    })));
    setCurrentScreen('playing');
  };

  return (
    <div style={{ backgroundColor: '#121212', color: '#ffffff', minHeight: '100vh', fontFamily: 'system-ui, sans-serif', paddingBottom: '70px' }}>
      <header style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #222', backgroundColor: '#1a1a1a' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: '#e53e3e' }}></div>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>مافيا الحارة</span>
        </div>
        <button onClick={() => setCurrentScreen('rules')} style={{ background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
          <HelpCircle size={22} />
        </button>
      </header>

      <main style={{ maxWidth: '480px', margin: '0 auto', padding: '20px' }}>
        {currentScreen === 'home' && (
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '20px', marginTop: '20px' }}>
            <div style={{ background: 'linear-gradient(180deg, #1f1a1a 0%, #1a1a1a 100%)', border: '1px solid #331d1d', borderRadius: '24px', padding: '30px 20px' }}>
              <div style={{ width: '70px', height: '70px', backgroundColor: '#e53e3e20', color: '#e53e3e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 15px auto', border: '1px solid #e53e3e40' }}>
                <Shield size={36} />
              </div>
              <h1 style={{ fontSize: '28px', fontWeight: '900', color: '#fff', marginBottom: '8px' }}>مافيا العراق</h1>
              <p style={{ color: '#888', fontSize: '14px', lineHeight: '1.5' }}>لعبة الذكاء والتخمين التفاعلية. انشئ غرفتك الخاصة والعب مع أصدقائك في الحارة.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="ادخل اسمك في اللعبة..."
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                style={{ padding: '16px', borderRadius: '14px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: '#fff', textAlign: 'center', fontSize: '16px', outline: 'none' }}
              />

              <button
                onClick={handleCreateRoom}
                style={{ padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: '#e53e3e', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <UserPlus size={20} /> إنشاء غرفة جديدة
              </button>

              <button
                onClick={() => setShowJoinModal(true)}
                style={{ padding: '16px', borderRadius: '14px', border: '1px solid #333', backgroundColor: '#1a1a1a', color: '#fff', fontWeight: '600', fontSize: '16px', cursor: 'pointer' }}
              >
                الانضمام لغرفة بـ Code
              </button>
            </div>
          </div>
        )}

        {currentScreen === 'lobby' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '20px', padding: '20px', textAlign: 'center' }}>
              <span style={{ color: '#888', fontSize: '12px' }}>رمز الغرفة الخاص بك</span>
              <h2 style={{ fontSize: '36px', fontWeight: 'bold', color: '#e53e3e', letterSpacing: '4px', margin: '5px 0' }}>{roomCode}</h2>
            </div>

            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #222', borderRadius: '20px', padding: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                <span style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Users size={18} color="#e53e3e" /> اللاعبون ({players.length})
                </span>
                <button onClick={addMockPlayer} style={{ backgroundColor: '#2a1a1a', border: '1px solid #e53e3e50', color: '#e53e3e', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer' }}>
                  + لاعب وهمي
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '200px', overflowY: 'auto' }}>
                {players.map((p) => (
                  <div key={p.id} style={{ padding: '12px 16px', backgroundColor: '#242424', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', border: '1px solid #333' }}>
                    <span>{p.name}</span>
                    {p.isHost && <span style={{ fontSize: '10px', backgroundColor: '#e53e3e20', color: '#e53e3e', padding: '2px 8px', borderRadius: '4px' }}>المضيف</span>}
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleStartGame}
              style={{ padding: '16px', borderRadius: '14px', border: 'none', backgroundColor: '#e53e3e', color: '#fff', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
            >
              <Play size={20} /> بدء اللعبة وتوزيع الأدوار
            </button>
          </div>
        )}

        {currentScreen === 'playing' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #331d1d', borderRadius: '20px', padding: '16px', textAlign: 'center' }}>
              <h2 style={{ color: '#e53e3e', fontSize: '20px', fontWeight: 'bold' }}>الجولة جارية الآن 🕵️‍♂️</h2>
              <p style={{ color: '#888', fontSize: '13px' }}>اضغط على اسمك بالأسفل لمشاهدة كارت دورك السري.</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {players.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setSelectedPlayer(p); setShowRole(false); }}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    border: selectedPlayer?.id === p.id ? '1px solid #e53e3e' : '1px solid #222',
                    backgroundColor: selectedPlayer?.id === p.id ? '#2a1a1a' : '#1a1a1a',
                    color: '#fff',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    cursor: 'pointer'
                  }}
                >
                  <span style={{ fontWeight: 'bold' }}>{p.name}</span>
                  <Eye size={18} color="#888" />
                </button>
              ))}
            </div>

            {selectedPlayer && (
              <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #e53e3e', borderRadius: '20px', padding: '20px', textAlign: 'center' }}>
                <p style={{ color: '#aaa', fontSize: '13px', marginBottom: '10px' }}>بطاقة اللاعب: <strong style={{ color: '#fff' }}>{selectedPlayer.name}</strong></p>
                {!showRole ? (
                  <button
                    onClick={() => setShowRole(true)}
                    style={{ padding: '12px 20px', backgroundColor: '#e53e3e20', border: '1px solid #e53e3e', color: '#e53e3e', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    إظهار الدور السري
                  </button>
                ) : (
                  <div style={{ backgroundColor: '#2a1515', border: '1px solid #e53e3e', borderRadius: '14px', padding: '16px', marginTop: '10px' }}>
                    <span style={{ fontSize: '32px' }}>{selectedPlayer.role?.icon}</span>
                    <h3 style={{ fontSize: '22px', color: '#e53e3e', margin: '5px 0' }}>{selectedPlayer.role?.name}</h3>
                    <p style={{ fontSize: '12px', color: '#ccc' }}>فريق: {selectedPlayer.role?.team}</p>
                    <p style={{ fontSize: '12px', color: '#888', marginTop: '8px' }}>{selectedPlayer.role?.desc}</p>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {currentScreen === 'rules' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#e53e3e' }}>قواعد اللعبة</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {ROLES.map((r) => (
                <div key={r.id} style={{ backgroundColor: '#1a1a1a', border: '1px solid #222', borderRadius: '16px', padding: '16px', display: 'flex', gap: '14px', alignItems: 'center' }}>
                  <span style={{ fontSize: '28px' }}>{r.icon}</span>
                  <div>
                    <h4 style={{ fontWeight: 'bold', color: '#fff' }}>{r.name}</h4>
                    <p style={{ fontSize: '12px', color: '#888' }}>{r.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setCurrentScreen('home')} style={{ padding: '14px', backgroundColor: '#222', border: 'none', color: '#fff', borderRadius: '12px', cursor: 'pointer' }}>
              العودة للرئيسية
            </button>
          </div>
        )}
      </main>

      {showJoinModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', zIndex: 100 }}>
          <div style={{ backgroundColor: '#1a1a1a', border: '1px solid #333', borderRadius: '24px', padding: '24px', width: '100%', maxWidth: '360px', position: 'relative' }}>
            <button onClick={() => setShowJoinModal(false)} style={{ position: 'absolute', top: '16px', left: '16px', background: 'none', border: 'none', color: '#888', cursor: 'pointer' }}>
              <X size={20} />
            </button>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', marginBottom: '16px', textAlign: 'center' }}>الانضمام إلى غرفة</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <input
                type="text"
                placeholder="اسمك"
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#242424', color: '#fff', textAlign: 'center' }}
              />
              <input
                type="text"
                placeholder="رمز الغرفة"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value)}
                style={{ padding: '12px', borderRadius: '10px', border: '1px solid #333', backgroundColor: '#242424', color: '#fff', textAlign: 'center' }}
              />
              <button onClick={handleJoinRoom} style={{ padding: '12px', borderRadius: '10px', border: 'none', backgroundColor: '#e53e3e', color: '#fff', fontWeight: 'bold', cursor: 'pointer' }}>
                دخول
              </button>
            </div>
          </div>
        </div>
      )}

      <nav style={{ position: 'fixed', bottom: 0, left: 0, right: 0, backgroundColor: '#1a1a1a', borderTop: '1px solid #222', display: 'flex', justifyContent: 'space-around', padding: '10px 0', zIndex: 90 }}>
        <button onClick={() => setCurrentScreen('home')} style={{ background: 'none', border: 'none', color: currentScreen === 'home' ? '#e53e3e' : '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '11px' }}>
          <Shield size={20} /> الرئيسية
        </button>
        <button onClick={() => setCurrentScreen('rules')} style={{ background: 'none', border: 'none', color: currentScreen === 'rules' ? '#e53e3e' : '#666', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer', fontSize: '11px' }}>
          <BookOpen size={20} /> القوانين
        </button>
      </nav>
    </div>
  );
}
