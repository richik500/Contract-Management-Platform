import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BlueprintForm from './components/BlueprintForm';

function App() {
  const [blueprints, setBlueprints] = useState([]);
  const [contracts, setContracts] = useState([]);
  const [filter, setFilter] = useState('All');
  const [userRole, setUserRole] = useState('ADMIN'); // RBAC State

  const fetchData = async () => {
    try {
      const bRes = await axios.get('http://localhost:5000/api/blueprints');
      const cRes = await axios.get('http://localhost:5000/api/contracts');
      setBlueprints(bRes.data);
      setContracts(cRes.data);
    } catch (err) { console.error("Data fetch failed", err); }
  };

  const deleteBlueprint = async (id) => {
    if(!window.confirm("Delete this blueprint?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/blueprints/${id}`);
      fetchData();
    } catch (err) { console.error(err); }
  };

  const renameContract = async (id, currentName) => {
    const newName = prompt("Rename instance:", currentName);
    if (!newName || newName === currentName) return;
    try {
      await axios.patch(`http://localhost:5000/api/contracts/${id}`, { name: newName });
      fetchData();
    } catch (err) { alert(err.response?.data?.error); }
  };

  const updateStatus = async (id, nextStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/contracts/${id}/status`, { nextStatus });
      fetchData();
    } catch (err) { alert(err.response?.data?.error || "Error updating status"); }
  };

  const createContract = async (blueprint) => {
    const name = prompt(`Enter name for ${blueprint.name}:`);
    if (!name) return;
    try {
      await axios.post('http://localhost:5000/api/contracts', { 
        blueprintId: blueprint._id, 
        name, 
        fieldValues: blueprint.fields.map(f => ({...f, value: ""})) 
      });
      fetchData();
    } catch (err) { console.error(err); }
  };

  const filteredContracts = contracts.filter(c => {
    if (filter === 'Pending') return c.status === 'Created';
    if (filter === 'Active') return ['Approved', 'Sent'].includes(c.status);
    if (filter === 'Completed') return ['Signed', 'Locked'].includes(c.status);
    return true;
  });

  const getStatusStyle = (status) => {
    const styles = {
      'Created': 'bg-blue-50 text-blue-600 border-blue-200',
      'Approved': 'bg-purple-50 text-purple-600 border-purple-200',
      'Sent': 'bg-orange-50 text-orange-600 border-orange-200',
      'Signed': 'bg-cyan-50 text-cyan-600 border-cyan-200',
      'Locked': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Revoked': 'bg-red-50 text-red-600 border-red-200'
    };
    return styles[status] || 'bg-slate-100';
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="min-h-screen min-w-full bg-[#fffcf5] py-10 px-6 lg:px-12 font-sans selection:bg-orange-100 selection:text-orange-900">
      
      <header className="w-full flex justify-between items-end mb-10 pb-6 border-b-2 border-slate-200">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg shadow-indigo-200 text-3xl text-white">📜</div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter text-left">Contractly.</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em] text-left">Enterprise Lifecycle Mgmt</p>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Switch Role</p>
            <div className="flex bg-slate-200 p-1 rounded-xl">
                <button onClick={() => setUserRole('ADMIN')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${userRole === 'ADMIN' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>ADMIN</button>
                <button onClick={() => setUserRole('SIGNER')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black transition-all ${userRole === 'SIGNER' ? 'bg-indigo-600 text-white' : 'text-slate-500'}`}>SIGNER</button>
            </div>
        </div>
      </header>

      <main className="w-full space-y-12">
        {userRole === 'ADMIN' && <BlueprintForm onBlueprintCreated={fetchData} />}

        <section className="w-full text-left">
          <h2 className="text-2xl font-black text-slate-800 mb-6 px-2">2. Available Blueprints</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-5 gap-6">
            {blueprints.map(b => (
              <div key={b._id} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-200 hover:border-indigo-300 transition-all group relative">
                {userRole === 'ADMIN' && (
                  <button onClick={() => deleteBlueprint(b._id)} className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 text-slate-300 hover:text-red-500 p-2 bg-slate-50 rounded-lg">🗑️</button>
                )}
                <div className="mb-6">
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">ID: {b._id.slice(-6)}</div>
                  <div className="text-xl font-bold text-slate-800 leading-tight mb-3">{b.name}</div>
                  <div className="flex flex-wrap gap-1.5">
                    {/* HIDE SIGNATURE IN PREVIEW */}
                    {b.fields.filter(f => f.type !== 'Signature' && f.label).map((f, i) => (
                      <span key={i} className="text-[8px] font-black bg-indigo-50 text-indigo-500 px-2 py-1 rounded-lg border border-indigo-100 uppercase">{f.label}</span>
                    ))}
                  </div>
                </div>
                <button onClick={() => createContract(b)} className="w-full bg-slate-900 text-white px-4 py-3 rounded-xl text-xs font-black hover:bg-indigo-600 transition-all uppercase">Create Contract</button>
              </div>
            ))}
          </div>
        </section>

        <section className="w-full bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/30 flex justify-between items-center">
            <h2 className="text-2xl font-black text-slate-800">3. Contract Dashboard</h2>
            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              {['All', 'Pending', 'Active', 'Completed'].map(tab => (
                <button key={tab} onClick={() => setFilter(tab)} className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === tab ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}>{tab}</button>
              ))}
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/80 text-slate-400 text-[11px] uppercase font-black tracking-widest border-b border-slate-200">
                <th className="px-10 py-5">Name</th>
                <th className="px-10 py-5">Status</th>
                <th className="px-10 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredContracts.map(c => (
                <tr key={c._id} className="group hover:bg-indigo-50/20 transition-all">
                  <td className="px-10 py-8 font-bold text-slate-800 text-lg flex items-center gap-2">
                    {c.name}
                    {c.status === 'Created' && userRole === 'ADMIN' && (
                        <button onClick={() => renameContract(c._id, c.name)} className="opacity-0 group-hover:opacity-100 text-slate-300 hover:text-indigo-500 transition-all">✏️</button>
                    )}
                  </td>
                  <td className="px-10 py-8">
                    <span className={`px-5 py-2 rounded-xl text-[10px] font-black border uppercase tracking-widest ${getStatusStyle(c.status)}`}>{c.status}</span>
                  </td>
                  <td className="px-10 py-8 text-right flex gap-3 justify-end items-center">
                    {/* ROLE-BASED ACTIONS */}
                    {userRole === 'ADMIN' && (
                        <>
                          {c.status === 'Created' && <button onClick={() => updateStatus(c._id, 'Approved')} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tighter">Approve ✅</button>}
                          {c.status === 'Approved' && <button onClick={() => updateStatus(c._id, 'Sent')} className="bg-blue-500 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tighter">Send 📩</button>}
                          {c.status === 'Signed' && <button onClick={() => updateStatus(c._id, 'Locked')} className="bg-emerald-600 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tighter">Lock 🔒</button>}
                          {!['Locked', 'Revoked'].includes(c.status) && (
                            <button onClick={() => updateStatus(c._id, 'Revoked')} className="text-red-300 hover:text-red-500 text-[10px] font-black uppercase px-4">Revoke</button>
                          )}
                        </>
                    )}
                    {userRole === 'SIGNER' && c.status === 'Sent' && (
                        <button onClick={() => updateStatus(c._id, 'Signed')} className="bg-amber-500 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-tighter">Sign ✍️</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}

export default App;