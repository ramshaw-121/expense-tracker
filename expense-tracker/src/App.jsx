import { useState } from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B', '#8B5CF6', '#EC4899'];

const CustomTooltip = ({ active, payload, total }) => {
  if (active && payload && payload.length) {
    const percent = ((payload[0].value / total) * 100).toFixed(1);
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
  const [data, setData] = useState([
    { name: 'Food', value: 1200 },
    { name: 'Shopping', value: 2000 },
    { name: 'Travel', value: 330 },
    { name: 'Study', value: 800 },
  ]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');

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
    <div style={{minHeight: '100vh', background: '#F8FAFC', padding: '30px', fontFamily: 'system-ui'}}>
      <div style={{maxWidth: '1100px', margin: '0 auto'}}>
        <h1 style={{fontSize: '28px', fontWeight: '800'}}>Expense Dashboard</h1>
        <p style={{color: '#64748B', marginTop: '5px'}}>Add karo, delete karo - chart live update hoga</p>

        {/* Add Form */}
        <form onSubmit={handleAdd} style={{background: 'white', padding: '20px', borderRadius: '16px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)', display: 'flex', gap: '12px', margin: '20px 0', flexWrap: 'wrap'}}>
          <input
            placeholder="Kya kharcha? Ex: Recharge"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{flex: 1, minWidth: '180px', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none'}}
          />
          <input
            type="number"
            placeholder="Kitna? Ex: 500"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            style={{width: '130px', padding: '12px 14px', borderRadius: '10px', border: '1px solid #E2E8F0', outline: 'none'}}
          />
          <button type="submit" style={{background: '#111827', color: 'white', border: 'none', padding: '12px 24px', borderRadius: '10px', fontWeight: '700', cursor: 'pointer'}}>
            + Add Expense
          </button>
        </form>

        <div style={{background: 'white', borderRadius: '20px', padding: '25px', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '20px'}}>

          <div style={{height: '400px', position: 'relative'}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={80} outerRadius={135} paddingAngle={3}>
                  {data.map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip total={total} />} />
              </PieChart>
            </ResponsiveContainer>
            <div style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center', pointerEvents: 'none'}}>
              <p style={{margin: 0, fontSize: '12px', color: '#94A3B8'}}>TOTAL</p>
              <p style={{margin: 0, fontSize: '24px', fontWeight: '800'}}>₹{total}</p>
            </div>
          </div>

          <div>
            <h3 style={{marginBottom: '10px'}}>Breakdown ({data.length})</h3>
            {data.map((item, i) => {
              const percent = ((item.value / total) * 100).toFixed(1);
              return (
                <div key={i} style={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #F1F5F9'}}>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <div style={{width: '12px', height: '12px', borderRadius: '50%', background: COLORS[i % COLORS.length]}}></div>
                    <span style={{fontWeight: '500'}}>{item.name}</span>
                    <span style={{color: '#64748B', fontSize: '13px'}}>{percent}%</span>
                  </div>
                  <div style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
                    <span style={{fontWeight: '700'}}>₹{item.value}</span>
                    <button onClick={() => handleDelete(i)} style={{background: '#FEE2E2', color: '#EF4444', border: 'none', borderRadius: '6px', padding: '4px 8px', cursor: 'pointer', fontSize: '12px'}}>X</button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
export default App;