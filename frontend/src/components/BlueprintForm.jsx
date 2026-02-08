import React, { useState } from 'react';
import axios from 'axios';

const BlueprintForm = ({ onBlueprintCreated }) => {
  const [name, setName] = useState('');
  const [fields, setFields] = useState([]);

  const addField = (type) => {
    let placeholder = "Enter field name";
    let inputType = "text";

    if (type === 'Text') {
      placeholder = "e.g., Full Legal Name";
    } else if (type === 'Date') {
      placeholder = "e.g., Commencement Date";
      inputType = "date"; 
    } else if (type === 'Signature') {
      placeholder = "Please enter your sign"; 
    }

    // We still initialize position to {0,0} for the backend demand
    setFields([...fields, { 
      type, 
      label: '', 
      placeholder, 
      inputType, 
      position: { x: 0, y: 0 } 
    }]);
  };

  const updateFieldLabel = (index, label) => {
    const newFields = [...fields];
    newFields[index].label = label;
    setFields(newFields);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!name || fields.length === 0) return alert("Please add a blueprint name and at least one detail.");
    try {
      await axios.post('http://localhost:5000/api/blueprints', { name, fields });
      setName('');
      setFields([]);
      onBlueprintCreated();
    } catch (err) { console.error("Error saving blueprint:", err); }
  };

  const getDisplayLabel = (type) => {
    if (type === 'Text') return 'NAME';
    if (type === 'Signature') return 'SIGN';
    return type; 
  };

  return (
    <div className="bg-white p-10 rounded-[2.5rem] shadow-xl shadow-orange-900/5 border border-orange-100 mb-10 w-full overflow-hidden relative">
      <h2 className="text-2xl font-black text-slate-800 mb-8 flex items-center">
        1. Create a Blueprint
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-orange-400 tracking-widest">Blueprint Name</label>
          <input 
            type="text" 
            placeholder="e.g. Service Level Agreement" 
            className="w-full p-4 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-orange-50 outline-none transition-all font-bold text-slate-700"
            value={name} 
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-orange-400 tracking-widest">Add Details</label>
          <div className="grid grid-cols-3 gap-3">
            <button onClick={() => addField('Text')} className="bg-orange-50/50 hover:bg-orange-100 text-orange-700 border border-orange-100 p-3 rounded-xl text-[10px] font-black transition-all uppercase">+ Add Name</button>
            <button onClick={() => addField('Date')} className="bg-orange-50/50 hover:bg-orange-100 text-orange-700 border border-orange-100 p-3 rounded-xl text-[10px] font-black transition-all uppercase">+ Add Date</button>
            <button onClick={() => addField('Signature')} className="bg-orange-50/50 hover:bg-orange-100 text-orange-700 border border-orange-100 p-3 rounded-xl text-[10px] font-black transition-all uppercase">+ Add Sign</button>
          </div>
        </div>
      </div>

      <div className="space-y-4 mb-10">
        {fields.map((field, index) => (
          <div key={index} className="flex flex-col gap-4 bg-[#fffcf9] p-6 rounded-[1.5rem] border border-orange-50 animate-in fade-in slide-in-from-top-4 shadow-sm">
            <div className="flex items-center gap-6">
              <div className="flex flex-col min-w-[80px]">
                  <span className="text-[10px] font-black uppercase text-orange-500 tracking-widest leading-none">
                    {getDisplayLabel(field.type)}
                  </span>
              </div>

              {/* Input for the Label */}
              <input 
                type={field.inputType}
                className="flex-1 p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-orange-300 outline-none shadow-sm font-medium"
                placeholder={field.placeholder}
                value={field.label}
                onChange={(e) => updateFieldLabel(index, e.target.value)} 
              />

              {/* Remove button remains, but X/Y inputs are GONE */}
              <button 
                onClick={() => setFields(fields.filter((_, i) => i !== index))}
                className="p-2 text-slate-300 hover:text-red-500 transition-all hover:bg-red-50 rounded-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={handleSubmit} 
        className="w-full bg-slate-900 hover:bg-indigo-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-indigo-100 transition-all active:scale-[0.99] uppercase tracking-[0.2em] text-sm"
      >
        Save Blueprint
      </button>
    </div>
  );
};

export default BlueprintForm;