import { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

const CustomTooltip = ({ active, payload, total }) => {
  if (active && payload && payload.length) {
    const percent = total > 0? ((payload[0].value / total) * 100).toFixed(1) : 0;
    return (
      <div style={{background: 'white', padding: '12px 16px', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.15)'}}>
        <p style={{margin: 0, fontWeight: 'bold'}}>{payload[0].name}</p>
        <p style={{margin: '4px 0 0 0', color: '#666'}}>₹{payload[0].value} ({percent}%)</p>
      </div>
    );
  }
  return null;
};

function App() {
  const [data, setData] = useState(() => {
    const saved = localStorage.getItem('my-expenses-v2');
    return saved? JSON.parse(saved) : [];
  });

  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    localStorage.setItem('my-expenses-v2', JSON.stringify(data));
  }, [data]);

  const total = data.reduce((sum, item) => sum + item.value, 0);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name ||!amount) return;
    setData([...data, { name: name, value: Number(amount) }]);
    setName('');
    setAmount('');
  };

  const handleDelete = (index) => {
    setData(data.filter((_, i) => i!== index));
  };

  return (
    <div style={{minHeight: '100vh', background: '#F8FAFC', padding: isMobile? '15px' : '30px', fontFamily: 'system-ui'}}>
      <div style={{maxWidth: '1100px', margin: '0 auto'}}>
        <h1 style={{fontSize: isMobile? '22px' : '28px', fontWeight: '800', margin: 0}}>Expense Dashboard</h1>
        <p style={{color: '#64748B', marginTop: '5px', fontSize: isMobile? '13px' : '14px'}}>Hisaab Kitaab</p>

        <form onSubmit={handleAdd} style={{background: 'white', padding: isMobile? '15px' : '20px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', gap: '10px', margin: '20px 0', flexWrap: 'wrap'}}>
          <input
            placeholder="Kya kharcha? Ex: Chai"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{flex: 1, minWidth: '140px', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '16px'}}
          />
          <input
            type="number"
            placeholder="₹ Kitna?"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{width: isMobile? '100px' : '130px', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none', fontSize: '16px'}}
          />
          <button type="submit" style={{background: '#111827', color: 'white', border: 'none', padding: '12px 20px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer', flex: isMobile? '1 1 100%' : 'none'}}>
            + Add
          </button>
        </form>

        {data.length === 0? (
          <div style={{background: 'white', borderRadius: '20px', padding: '40px 20px', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.06)'}}>
            <p style={{fontSize: '40px', margin: 0}}>📊</p>
            <p style={{fontWeight: '700', marginTop: '10px'}}>Abhi koi kharcha nahi</p>
            <p style={{color: '#94A3B8', fontSize: '14px'}}>Upar se pehla kharcha add karo</p>
          </div>
        ) : (
          <div style={{background: 'white', borderRadius: '20px', padding: isMobile? '15px' : '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'grid', gridTemplateColumns: isMobile? '1fr' : '1.2fr 0.8fr', gap: '20px'}}>
            <div style={{height: isMobile? '300px' : '400px', position: 'relative'}}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={isMobile? 60 : 80} outerRadius={isMobile? 100 : 135} paddingAngle={3}>
                    {data.map((_, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip total={total} />} />
                </PieChart>
              </ResponsiveContainer>
              <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none'}}>
                <p style={{margin: 0, fontSize: '11px', color: '#94A3B8', letterSpacing: '1px'}}>TOTAL</p>
                <p style={{margin: 0, fontSize: isMobile? '20px' : '24px', fontWeight: '800'}}>₹{total}</p>
              </div>
            </div>

            <div>
              <h3 style={{margin: '0 0 10px 0', fontSize: isMobile? '16px' : '18px'}}>Breakdown ({data.length})</h3>
              <div style={{maxHeight: isMobile? 'none' : '350px', overflowY: 'auto'}}>
                {data.map((item, i) => {
                  const percent = total > 0? ((item.value / total) * 100).toFixed(1) : 0;
                  return (
                    <div key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F1F5F9'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px', flex: 1}}>
                        <div style={{width: '10px', height: '10px', borderRadius: '50%', background: COLORS[i % COLORS.length]}}></div>
                        <span style={{fontWeight: '500', fontSize: '14px'}}>{item.name}</span>
                        <span style={{color: '#64748B', fontSize: '12px'}}>{percent}%</span>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '8px'}}>
                        <span style={{fontWeight: '700', fontSize: '14px'}}>₹{item.value}</span>
                        <button onClick={() => handleDelete(i)} style={{background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '11px', fontWeight: 'bold'}}>X</button>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default App;