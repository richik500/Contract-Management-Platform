import React, { useEffect, useState } from 'react';
import axios from 'axios';
import BlueprintForm from './components/BlueprintForm';

function App() {
  const [blueprints, setBlueprints] = useState([]);
  const [contracts, setContracts] = useState([]);

  const fetchData = async () => {
    try {
      const bRes = await axios.get('http://localhost:5000/api/blueprints');
      const cRes = await axios.get('http://localhost:5000/api/contracts');
      setBlueprints(bRes.data);
      setContracts(cRes.data);
    } catch (err) { console.error("Fetch failed", err); }
  };

  const deleteBlueprint = async (id) => {
    if(window.confirm("Permanent Delete: Are you sure?")) {
      await axios.delete(`http://localhost:5000/api/blueprints/${id}`);
      fetchData();
    }
  };

  const renameContract = async (id, oldName) => {
    const newName = prompt("Enter new contract name:", oldName);
    if (!newName || newName === oldName) return;
    try {
      await axios.patch(`http://localhost:5000/api/contracts/${id}`, { name: newName });
      fetchData();
    } catch (err) { alert("Error renaming contract"); }
  };

  const updateStatus = async (id, nextStatus) => {
    try {
      await axios.patch(`http://localhost:5000/api/contracts/${id}/status`, { nextStatus });
      fetchData();
    } catch (err) { alert(err.response?.data?.error || "Error updating status"); }
  };

  const createContract = async (blueprint) => {
    const name = prompt(`Assign a unique name for this ${blueprint.name} instance:`);
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

  const getStatusStyle = (status) => {
    const map = {
      'Created': 'bg-blue-50 text-blue-600 border-blue-200',
      'Approved': 'bg-purple-50 text-purple-600 border-purple-200',
      'Sent': 'bg-orange-50 text-orange-600 border-orange-200',
      'Signed': 'bg-cyan-50 text-cyan-600 border-cyan-200',
      'Locked': 'bg-emerald-50 text-emerald-700 border-emerald-200',
      'Revoked': 'bg-red-50 text-red-600 border-red-200'
    };
    return map[status] || 'bg-gray-100';
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="min-h-screen min-w-full bg-[#fffcf5] py-10 px-6 lg:px-12 font-sans selection:bg-orange-100 selection:text-orange-900">
      
      {/* HEADER */}
      <header className="w-full flex justify-between items-end mb-10 pb-6 border-b-2 border-slate-200">
        <div className="flex items-center gap-4">
          <div className="bg-indigo-600 p-3 rounded-2xl shadow-lg">
             <span className="text-3xl">📜</span>
          </div>
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter">Contractly.</h1>
            <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.2em]">Enterprise Lifecycle Mgmt</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-sm font-bold text-slate-800">{new Date().toLocaleDateString('en-US')}</div>
          <div className="text-xs text-indigo-500 font-bold uppercase tracking-widest">System Operational</div>
        </div>
      </header>

      <main className="w-full space-y-12">
        {/* 1. CREATE A BLUEPRINT */}
        <section className="w-full">
          <BlueprintForm onBlueprintCreated={fetchData} />
        </section>

        {/* 2. AVAILABLE BLUEPRINTS */}
        <section className="w-full">
          <div className="flex justify-between items-center mb-6 px-2">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight text-uppercase">2. Available Blueprints</h2>
            {/* UPDATED TEXT: BLUEPRINTS instead of TEMPLATES */}
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest border-b-2 border-slate-200 pb-1">
                {blueprints.length} BLUEPRINTS LOADED
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {blueprints.map(b => (
              <div key={b._id} className="bg-white p-6 rounded-[2rem] shadow-sm border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-50/50 transition-all group relative">
                <div className="mb-6">
                  <div className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-2">REF: {b._id.slice(-6)}</div>
                  <div className="text-xl font-bold text-slate-800 leading-tight group-hover:text-indigo-600 transition-colors mb-3">{b.name}</div>
                  
                  {/* Badge Logic: Only Name and Date labels shown */}
                  <div className="flex flex-wrap gap-1.5">
                    {b.fields && b.fields
                      .filter(f => (f.type === 'Text' || f.type === 'Date') && f.label && f.label.trim() !== "")
                      .map((f, i) => (
                        <span key={i} className="text-[9px] font-black bg-indigo-50 text-indigo-500 px-2.5 py-1 rounded-lg border border-indigo-100 uppercase tracking-tighter">
                          {f.label}
                        </span>
                      ))
                    }
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button onClick={() => createContract(b)} className="flex-1 bg-slate-900 text-white px-4 py-3 rounded-2xl text-[10px] font-black hover:bg-indigo-600 transition-all active:scale-95 uppercase tracking-widest">Create Contract</button>
                  <button onClick={() => deleteBlueprint(b._id)} className="p-3 rounded-2xl bg-red-50 text-red-500 hover:bg-red-500 hover:text-white transition-all border border-red-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 3. CONTRACT DASHBOARD */}
        <section className="w-full bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200/60 border border-slate-200 overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/30">
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">3. Contract Dashboard</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-400 text-[11px] uppercase font-black tracking-[0.15em] border-b border-slate-200">
                  <th className="px-10 py-6">Contract Name</th>
                  <th className="px-10 py-6">Current Status</th>
                  <th className="px-10 py-6 text-right">Lifecycle Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {contracts.map(c => (
                  <tr key={c._id} className="group hover:bg-indigo-50/20 transition-all">
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className="font-bold text-slate-800 text-xl">{c.name}</div>
                        {c.status === 'Created' && (
                          <button onClick={() => renameContract(c._id, c.name)} className="text-slate-300 hover:text-indigo-500 transition-all hover:scale-110">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <span className={`px-6 py-2.5 rounded-2xl text-[10px] font-black border uppercase tracking-[0.1em] shadow-sm inline-block ${getStatusStyle(c.status)}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex gap-3 justify-end items-center">
                        {c.status === 'Created' && <button onClick={() => updateStatus(c._id, 'Approved')} className="bg-indigo-600 text-white px-8 py-3 rounded-2xl text-xs font-black hover:shadow-indigo-200 shadow-lg transition-all active:scale-95 uppercase tracking-tighter">Approve ✅</button>}
                        {c.status === 'Approved' && <button onClick={() => updateStatus(c._id, 'Sent')} className="bg-blue-500 text-white px-8 py-3 rounded-2xl text-xs font-black hover:shadow-blue-200 shadow-lg transition-all active:scale-95 uppercase tracking-tighter">Send 📩</button>}
                        {c.status === 'Sent' && <button onClick={() => updateStatus(c._id, 'Signed')} className="bg-amber-500 text-white px-8 py-3 rounded-2xl text-xs font-black hover:shadow-amber-200 shadow-lg transition-all active:scale-95 uppercase tracking-tighter">Sign ✍️</button>}
                        {c.status === 'Signed' && <button onClick={() => updateStatus(c._id, 'Locked')} className="bg-emerald-600 text-white px-8 py-3 rounded-2xl text-xs font-black hover:shadow-emerald-200 shadow-lg transition-all active:scale-95 uppercase tracking-tighter">Lock 🔒</button>}
                        
                        {!['Locked', 'Revoked'].includes(c.status) && (
                          <button onClick={() => updateStatus(c._id, 'Revoked')} className="text-slate-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest px-6 py-2 border border-transparent hover:border-red-100 rounded-xl transition-all">Revoke</button>
                        )}
                        {(c.status === 'Locked' || c.status === 'Revoked') && (
                          <span className="text-slate-300 text-[10px] font-black uppercase tracking-widest px-6 italic">No Actions</span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;